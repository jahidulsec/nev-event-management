"use server";

import { apiResponse } from "@/lib/response";
import { notificationService } from "@/services/notification";
import {
  CreateNotificationDTOType,
  createNotificationDTOSchema,
  UpdateNotificationDTOType,
  updateNotificationDTOSchema,
} from "@/features/notifications/schema/schema";

export const createNotification = async (data: CreateNotificationDTOType) => {
  try {
    const { employee_id, event_id, ...rest } =
      createNotificationDTOSchema.parse(data);

    const res = await notificationService.createNotification({
      data: {
        ...rest,
        users: { connect: { employee_id } },
        events: { connect: { id: event_id } },
      },
    });

    return apiResponse.single({
      data: res,
      message: "Notification created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateNotification = async (
  id: string,
  data: UpdateNotificationDTOType,
) => {
  try {
    const validatedData = updateNotificationDTOSchema.parse(data);

    const res = await notificationService.updateNotification({
      filter: { id },
      data: validatedData,
    });

    return apiResponse.single({
      data: res,
      message: "Notification updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
