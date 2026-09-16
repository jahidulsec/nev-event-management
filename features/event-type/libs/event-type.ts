"use server";

import { apiResponse } from "@/lib/response";
import { QuerySchema, QuerySchemaType } from "@/schemas/query";
import { eventTypeService } from "@/services/event-type";
import { Prisma } from "@/lib/generated/prisma/client";
import { ServerCacheOptions } from "@/lib/server-cache";

export type EventTypeMultiProps = Prisma.event_typeGetPayload<object>;

export const getEventTypes = async (query: QuerySchemaType) => {
  try {
    const { page, size, search } = QuerySchema.parse(query);

    const filter: Prisma.event_typeWhereInput = {
      ...(search && {
        OR: [
          {
            title: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      eventTypeService.getEventTypes({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          title: "asc",
        },
      }),
      eventTypeService.getEventTypeCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getEventType = async (
  id: string,
  revalidate?: ServerCacheOptions["revalidate"],
) => {
  try {
    const [res] = await Promise.all([
      eventTypeService.getEventTypeUniq({
        filter: {
          id,
        },
        cacheOption: {
          revalidate: revalidate,
        },
      }),
    ]);

    return apiResponse.single({
      data: res,
      message: "GET event type successful",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
