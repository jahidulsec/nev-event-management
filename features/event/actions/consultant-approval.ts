"use server";

import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { db } from "@/config/db";
import { EventECApprovalType, EventFirstApprovalType } from "./schema";

export const createFirstApproverApproval = async (
  data: EventFirstApprovalType,
) => {
  try {
    const res = await db.event_consultant_approval.upsert({
      where: {
        consultant_Id: data.consultant_id,
      },
      create: {
        consultant_Id: data.consultant_id,
        topic_expert: data.topic_expert,
        is_suitable: data.is_suitable,
        first_approver_id: data.first_approver_id,
      },
      update: {
        topic_expert: data.topic_expert,
        is_suitable: data.is_suitable,
        first_approver_id: data.first_approver_id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "Event status is submitted successfully",
      data: res,
    });
  } catch (error) {
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const createECapproval = async (data: EventECApprovalType) => {
  try {
    const res = await db.event_consultant_approval.upsert({
      where: {
        consultant_Id: data.consultant_id,
      },
      create: {
        consultant_Id: data.consultant_id,
        nth_engagement: data.nth_engagement,
        consultant_form_attached: data.consultant_form_attached,
        honorarium_check: data.hororarium_check,
        ec_id: data.ec_id,
      },
      update: {
        nth_engagement: data.nth_engagement,
        consultant_form_attached: data.consultant_form_attached,
        honorarium_check: data.hororarium_check,
        ec_id: data.ec_id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "Event status is submitted successfully",
      data: res,
    });
  } catch (error) {
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};
