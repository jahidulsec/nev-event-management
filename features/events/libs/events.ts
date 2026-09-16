"use server";

import { apiResponse } from "@/lib/response";
import { QuerySchema, QuerySchemaType } from "@/schemas/query";
import { eventService } from "@/services/events";
import { Prisma } from "@/lib/generated/prisma/client";
import { ServerCacheOptions } from "@/lib/server-cache";

export type EventMultiProps = Prisma.eventsGetPayload<{
  include: {
    users: { select: { full_name: true; employee_id: true } };
    product: { select: { name: true } };
    event_type: true;
  };
}>;

export const getEvents = async (query: QuerySchemaType) => {
  try {
    const { page, size, search } = QuerySchema.parse(query);

    const filter: Prisma.eventsWhereInput = {
      ...(search && {
        OR: [
          {
            title: {
              startsWith: search,
            },
          },
          {
            track_no: {
              startsWith: search,
            },
          },
          {
            employee_id: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      eventService.getEvents({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          created_at: "desc",
        },
        options: {
          include: {
            users: { select: { full_name: true, employee_id: true } },
            product: { select: { name: true } },
            event_type: true,
          },
        },
      }),
      eventService.getEventCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getEvent = async (
  id: string,
  revalidate?: ServerCacheOptions["revalidate"],
) => {
  try {
    const [res] = await Promise.all([
      eventService.getEventUniq({
        filter: {
          id,
        },
        cacheOption: {
          revalidate: revalidate,
        },
      }),
    ]);

    return apiResponse.single({ data: res, message: "GET event successful" });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
