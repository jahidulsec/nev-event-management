import { handleError } from "@/lib/error";
import { apiResponse } from "@/lib/response";
import {
  EventStatusHistoryQuerySchema,
  EventStatusHistoryQueryType,
} from "../actions/schema";
import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma";

export type EventStatusHistoryMultiProps =
  Prisma.event_status_historyGetPayload<{
    include: {
      event_approver: true;
    };
  }>;

export const getEventStatusHistories = async (
  params: EventStatusHistoryQueryType,
) => {
  try {
    const validatedParams = EventStatusHistoryQuerySchema.parse(params);

    const filter: Prisma.event_status_historyWhereInput = {
      ...(validatedParams.event_id && {
        event_approver: {
          event_id: validatedParams.event_id,
        },
      }),
    };

    const [res, count] = await Promise.all([
      db.event_status_history.findMany({
        where: filter,
        include: {
          event_approver: true,
        },
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
      }),
      db.event_status_history.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<EventStatusHistoryMultiProps>({
      message: "Get event type approvers successful",
      data: res as EventStatusHistoryMultiProps[],
      count,
    });
  } catch (error) {
    const err = handleError(error);
    return apiResponse.error({ error: err });
  }
};
