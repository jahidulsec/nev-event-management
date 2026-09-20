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
    event_approvers: {
      select: { employee_id: true; user_role: true };
    };
  };
}>;

const eventSingleInclude = {
  event_attachments: true,
  event_budgets: true,
  event_consultants: {
    include: { doctor: true, event_consultant_approvals: true },
  },
  product: { select: { name: true } },
  area: {
    select: { area_name: true, area: { select: { area_name: true } } },
  },
  event_type: {
    include: {
      approver: {
        orderBy: {
          created_at: "asc",
        },
      },
    },
  },
  event_approvers: {
    include: {
      event_status_histories: true,
      users: { select: { full_name: true, designation: true } },
    },
    orderBy: { created_at: "asc" },
  },
  users: {
    select: { full_name: true, employee_id: true, designation: true },
  },
} satisfies Prisma.eventsInclude;

export type EventSingleProps = Prisma.eventsGetPayload<{
  include: typeof eventSingleInclude;
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
            event_approvers: {
              select: { employee_id: true, user_role: true },
              orderBy: { created_at: "desc" },
              take: 1,
            },
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
        options: { include: eventSingleInclude },
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
