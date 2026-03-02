"use server";

import { apiResponse } from "@/lib/response";
import {
  NotificationType,
  UpdateNotificationSchema,
  UpdateNotificationType,
} from "./schema";
import { db } from "@/config/db";
import { revalidatePath } from "next/cache";

export const createNotification = async (data: NotificationType) => {
  try {
    const res = await db.notification.create({
      data: data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return apiResponse.single({
      message: "Notification is created",
      data: res,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error });
  }
};

export const updateNotification = async (
  id: string,
  data: UpdateNotificationType,
) => {
  try {
    const validatedData = UpdateNotificationSchema.parse(data);

    const res = await db.notification.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return apiResponse.single({
      message: "Notification is created",
      data: res,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error });
  }
};
