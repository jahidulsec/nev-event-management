"use server";

import { handleError } from "@/lib/error";
import { EventConsultantApprovalType } from "./schema";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { db } from "@/config/db";

export const createConsultantApproval = async (
  data: EventConsultantApprovalType,
) => {
  try {
    const res = await db.event_consultant_approval.create({
      data: {
        consultant_Id: data.consultant_id,
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
