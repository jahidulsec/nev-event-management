"use server";

import { apiResponse } from "@/lib/response";
import { Prisma } from "@/lib/generated/prisma";
import { db } from "@/config/db";
import {
  NotificaitonQuerySchema,
  NotificaitonQueryType,
  NotificaitonStatsQuery,
  NotificaitonStatsQueryType,
} from "../actions/schema";

export type NotificationMultiProps = Prisma.notificationGetPayload<{
  include: {
    event: {
      select: {
        title: true;
      };
    };
  };
}>;

export const getNotifications = async (query: NotificaitonQueryType) => {
  try {
    const validatedParam = NotificaitonQuerySchema.parse(query);

    const filter: Prisma.notificationWhereInput = {
      work_area_code: validatedParam.work_area_code,
      ...(validatedParam.search && {
        OR: [
          {
            event: {
              title: {
                startsWith: validatedParam.search,
              },
            },
          },
          {
            event: {
              track_no: {
                startsWith: validatedParam.search,
              },
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      db.notification.findMany({
        where: filter,
        include: {
          event: {
            select: {
              title: true,
            },
          },
        },
        skip: (validatedParam.page - 1) * validatedParam.size,
        take: validatedParam.size,
        orderBy: {
          created_at: validatedParam.sort ?? "desc",
        },
      }),
      db.notification.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<NotificationMultiProps>({
      message: "Get notifications succuessful",
      data: res,
      count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error });
  }
};

export const getNotificationStats = async (query: NotificaitonStatsQueryType) => {
  try {
    const params = NotificaitonStatsQuery.parse(query)

    const data = await db.notification.aggregate({
      where: {
        work_area_code: params.work_area_code
      },
      _count: {
        is_marked: true,
      },
    });

    return apiResponse.single({
      message: "get notification stats successful",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error });
  }
};
