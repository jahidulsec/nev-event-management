"use server";

import { apiResponse } from "@/lib/response";
import { cacheTags } from "@/lib/server-cache";
import { eventConsultantApprovalService } from "@/services/event-consultant-approvers";
import { updateTag } from "next/cache";
import {
  createFirstApproverApprovalPayloadSchema,
  CreateFirstApproverApprovalPayloadType,
} from "../schema/schema";

export const createFirstApproverApproval = async (
  data: CreateFirstApproverApprovalPayloadType,
) => {
  try {
    const { consultant_id, first_approver_id, topic_expert, is_suitable } =
      createFirstApproverApprovalPayloadSchema.parse(data);

    const approval = { first_approver_id, topic_expert, is_suitable };

    // the EC may have already created the approval record
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
    updateTag(cacheTags.eventConsultantApprovals);

    return apiResponse.single({
      data: res,
      message: "Consultant approval is submitted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
