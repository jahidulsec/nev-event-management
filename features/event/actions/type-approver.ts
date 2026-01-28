"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { EventTypeApproverType } from "./schema";
import { Prisma } from "@/lib/generated/prisma";



export const createEventTypeApprover = async (data: EventTypeApproverType) => {
  try {
    const etype = await db.approver.create({
      data: data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/permission/approver");

    return response({
      success: true,
      message: "New event type approver is created successfully",
      data: etype,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const updateEventTypeApprover = async (
  id: string,
  data: EventTypeApproverType,
) => {
  try {
    const etype = await db.approver.update({
      where: { id },
      data: data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/permission/approver");

    return response({
      success: true,
      message: "Event type approver is updated successfully",
      data: etype,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const deleteEventTypeApprover = async (id: string) => {
  try {
    const type = await db.approver.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/permission/approver");

    return response({
      success: true,
      message: "Event type approver is deleted successfully",
      data: type,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};
