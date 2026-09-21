"use server";

import { apiResponse } from "@/lib/response";
import { Prisma } from "@/lib/generated/prisma/client";
import { notificationService } from "@/services/notification";
import {
  notificationQuerySchema,
  NotificationQueryType,
  notificationStatsQuerySchema,
  NotificationStatsQueryType,
} from "@/features/notifications/schema/schema";

export type NotificationMultiProps = Prisma.notificationsGetPayload<{
  include: {
    events: {
      select: {
        title: true;
        type: true;
        product: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

export const getNotifications = async (query: NotificationQueryType) => {
  try {
    const { page, size, search, sort, employee_id, is_marked, status } =
      notificationQuerySchema.parse(query);

    const filter: Prisma.notificationsWhereInput = {
      employee_id,
      is_marked,
      status,
      ...(search && {
        OR: [
          { events: { title: { startsWith: search } } },
          { events: { track_no: { startsWith: search } } },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      notificationService.getNotifications({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: { created_at: sort ?? "desc" },
        options: {
          include: {
            events: {
              select: {
                title: true,
                type: true,
                product: { select: { name: true } },
              },
            },
          },
        },
      }),
      notificationService.getNotificationCount({ filter }),
    ]);

    return apiResponse.multi<NotificationMultiProps>({
      message: "Get notifications successful",
      data: (res ?? []) as NotificationMultiProps[],
      count,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getNotificationStats = async (
  query: NotificationStatsQueryType,
) => {
  try {
    const { employee_id } = notificationStatsQuerySchema.parse(query);

    const [total, marked, action] = await Promise.all([
      notificationService.getNotificationCount({ filter: { employee_id } }),
      notificationService.getNotificationCount({
        filter: { employee_id, is_marked: "yes" },
      }),
      notificationService.getNotificationCount({
        filter: { employee_id, status: "action" },
      }),
    ]);

    return apiResponse.single({
      message: "Get notification stats successful",
      data: { total, marked, action },
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
