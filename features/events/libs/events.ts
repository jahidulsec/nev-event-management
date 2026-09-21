"use server";

import { apiResponse } from "@/lib/response";
import { eventService } from "@/services/events";
import { Prisma } from "@/lib/generated/prisma/client";
import { ServerCacheOptions } from "@/lib/server-cache";
import { getActivePermissions } from "@/lib/permission-guard";
import { eventQuerySchema, EventQueryType } from "../schemas/events";

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

// area type goes mio -> rm -> zm -> sm -> wing, so an event area is at most 4 parents below the user's area
const AREA_MAX_DEPTH = 4;

// matches an event whose area is the given area or any of its descendants
const getAreaHierarchyFilter = (
  sap_area_code: string,
): Prisma.areaWhereInput => {
  const levels: Prisma.areaWhereInput[] = [{ sap_area_code }];
  let nested: Prisma.areaWhereInput = { sap_area_code };

  for (let depth = 0; depth < AREA_MAX_DEPTH; depth++) {
    nested = { area: nested };
    levels.push(nested);
  }

  return { OR: levels };
};

const getEventAccessFilter = ({
  role,
  employee_id,
  sap_area_code,
}: Pick<
  EventQueryType,
  "role" | "employee_id" | "sap_area_code"
>): Prisma.eventsWhereInput => {
  // superadmin can access all events
  if (role === "superadmin") return {};

  // ec, marketing can access events of their assigned products
  if (role === "ec" || role === "marketing") {
    return employee_id
      ? { product: { user_product: { some: { employee_id } } } }
      : { id: { in: [] } };
  }

  // other users can access events of their area and its child areas
  return role && sap_area_code
    ? { area: getAreaHierarchyFilter(sap_area_code) }
    : { id: { in: [] } };
};

export const getEvents = async (query: EventQueryType) => {
  try {
    const { page, size, search, role, sap_area_code, employee_id } =
      eventQuerySchema.parse(query);

    const permissions = await getActivePermissions();

    if (!permissions.includes("event:view"))
      throw new Error("You do not have permission to view events");

    // `event:view_all` bypasses the area/product scope
    const accessFilter = permissions.includes("event:view_all")
      ? {}
      : getEventAccessFilter({ role, employee_id, sap_area_code });

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
      ...accessFilter,
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
