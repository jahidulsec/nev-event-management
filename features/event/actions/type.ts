"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { EventTypeType } from "./schema";

export const createEventType = async (data: EventTypeType) => {
  try {
    const { type, ...rest } = data;

    const etype = await db.event_type.create({
      data: rest,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/permission");

    return response({
      success: true,
      message: "New event type is created successfully",
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

export const updateEventType = async (id: string, data: EventTypeType) => {
  try {
    const { type, ...rest } = data;

    const etype = await db.event_type.update({
      where: { id },
      data: rest,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/permission");

    return response({
      success: true,
      message: "Event type is updated successfully",
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

export const deleteEventType = async (id: string) => {
  try {
    const type = await db.event_type.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/permission");

    return response({
      success: true,
      message: "Event type is deleted successfully",
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
