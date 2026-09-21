"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { apiResponse } from "@/lib/response";
import { ServerCacheOptions } from "@/lib/server-cache";
import { eventTypeService } from "@/services/event-type";
import { getCleanData } from "@/utils/formatter";
import { getSerializeData } from "@/utils/helper";
import { eventTypeQuerySchema, EventTypeQueryType } from "../schema/schema";

export type EventTypeMultiProps = Prisma.event_typeGetPayload<{
  include: { approver: true };
}>;

export const getEventTypes = async (query: EventTypeQueryType) => {
  try {
    const { page, size, search, sort } = eventTypeQuerySchema.parse(
      getCleanData(query),
    );

    const filter: Prisma.event_typeWhereInput = {
      ...(search && {
        title: {
          contains: search,
        },
      }),
    };

    const [res, count] = await Promise.all([
      eventTypeService.getEventTypes({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          title: sort ?? "asc",
        },
        options: {
          include: {
            approver: {
              select: {
                user_type: true,
                type: true,
              },
              orderBy: { created_at: "asc" },
            },
          },
        },
      }),
      eventTypeService.getEventTypeCount({ filter }),
    ]);

    return apiResponse.multi<EventTypeMultiProps>({
      message: "Get event types successful",
      data: getSerializeData(res ?? []) as EventTypeMultiProps[],
      count,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getEventType = async (
  id: string,
  revalidate?: ServerCacheOptions["revalidate"],
) => {
  try {
    const res = await eventTypeService.getEventTypeUniq({
      filter: { id },
      cacheOption: { revalidate },
    });

    if (!res) throw new Error("Data not found");

    return apiResponse.single({
      data: getSerializeData(res) as typeof res,
      message: "Get event type successful",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
