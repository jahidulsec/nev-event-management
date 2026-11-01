"use server";

import { apiResponse } from "@/lib/response";
import { cacheTags } from "@/lib/server-cache";
import { eventConsultantApprovalService } from "@/services/event-consultant-approvers";
import { updateTag } from "next/cache";
import {
  createECApprovalPayloadSchema,
  CreateECApprovalPayloadType,
} from "../schema/schema";

export const createECApproval = async (data: CreateECApprovalPayloadType) => {
  try {
    const {
      consultant_id,
      ec_id,
      honorarium_check,
      consultant_form_attached,
      nth_engagement,
    } = createECApprovalPayloadSchema.parse(data);

    const approval = {
      ec_id,
      honorarium_check,
      consultant_form_attached,
      nth_engagement,
    };

    // first approver may have already created the approval record
    const existing =
      await eventConsultantApprovalService.getEventConsultantApprovalUniq({
        filter: { consultant_Id: consultant_id },
        cacheOption: { cache: false },
      });

    const res = existing
      ? await eventConsultantApprovalService.updateEventConsultantApproval({
          filter: { id: existing.id },
          data: approval,
        })
      : await eventConsultantApprovalService.createEventConsultantApproval({
          data: {
            ...approval,
            event_consultants: { connect: { id: consultant_id } },
          },
        });

    if (!res) throw new Error("Failed to submit consultant approval");

    updateTag(cacheTags.events);

    return apiResponse.single({
      data: res,
      message: "Consultant approval is submitted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
