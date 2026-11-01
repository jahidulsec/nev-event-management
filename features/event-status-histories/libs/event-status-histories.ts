"use server";

import { apiResponse } from "@/lib/response";
import { Prisma } from "@/lib/generated/prisma/client";
import { eventStatusHistoryService } from "@/services/event-status-histories";
import {
  eventStatusHistoryQuerySchema,
  EventStatusHistoryQueryType,
} from "../schema/schema";

export type EventStatusHistoryMultiProps =
  Prisma.event_status_historiesGetPayload<{
    include: {
      event_approvers: {
        include: {
          users: {
            select: {
              full_name: true;
              designation: true;
            };
          };
        };
      };
    };
  }>;

export const getEventStatusHistories = async (
  query: EventStatusHistoryQueryType,
) => {
  try {
    const { page, size, sort, event_id } =
      eventStatusHistoryQuerySchema.parse(query);

    const filter: Prisma.event_status_historiesWhereInput = {
      ...(event_id && {
        event_approvers: {
          event_id,
        },
      }),
    };

    const [res, count] = await Promise.all([
      eventStatusHistoryService.getEventStatusHistories({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          created_at: sort ?? "desc",
        },
        options: {
          include: {
            event_approvers: {
              include: {
                users: {
                  select: {
                    full_name: true,
                    designation: true,
                  },
                },
              },
            },
          },
        },
      }),
      eventStatusHistoryService.getEventStatusHistoryCount({ filter }),
    ]);

    return apiResponse.multi<EventStatusHistoryMultiProps>({
      message: "Get event status histories successful",
      data: res ?? [],
      count,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
