"use server";

import { apiResponse } from "@/lib/response";
import { eventService } from "@/services/events";
import { Prisma } from "@/lib/generated/prisma/client";
import { ServerCacheOptions } from "@/lib/server-cache";
import { assertPermission, getActivePermissions } from "@/lib/permission-guard";
import { getAuthUser, getDashboardArea, getDashboardRole } from "@/lib/dal";
import { startOfDay, endOfDay } from "date-fns";
import {
  eventExportQuerySchema,
  eventQuerySchema,
  EventExportQueryType,
  EventQueryType,
} from "../schemas/events";
import { getEventScopeFilter } from "../utils/access";

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

export const getEvents = async (query: EventQueryType) => {
  try {
    const { page, size, search, role, sap_area_code, employee_id } =
      eventQuerySchema.parse(query);

    const permissions = await getActivePermissions();

    if (!permissions.includes("event:view"))
      throw new Error("You do not have permission to view events");

    const accessFilter = getEventScopeFilter(permissions, {
      role,
      employee_id,
      sap_area_code,
    });

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

// fixed budget item names set on event creation, see EventBudgetSection
const eventBudgetItem = {
  venue: "Venue Charge",
  food: "Food",
  transportation: "Transportation",
  projector: "Projector-Screen",
  sound: "Sound System",
  other: "Logistics/Others",
} as const;

export type EventExportRow = {
  track_no: string | null;
  work_area: string;
  employee_id: string | null;
  full_name: string;
  group_name: string | null;
  title: string;
  product: string;
  event_title: string;
  rm_name: string | null;
  rm_code: string | null;
  created_at: Date | null;
  event_date: Date;
  venue: string;
  institute: string;
  institute_dept: string;
  food_supplier: string;
  external_participants: number;
  internal_participants: number;
  total_participants: number;
  venue_charge: number;
  food_unit: number;
  food_per_cost: number;
  food_cost: number;
  transportation: number;
  projector: number;
  sound_system: number;
  other_cost: number;
  total_budget: number;
  total_eb_h: number;
  dr_child_id: string | null;
  dr_name: string | null;
  role: string | null;
  honorarium: number;
  h_words: string;
  nth_engagement: number | null;
  current_status: string | null;
  approval_date: Date | null;
};

export const getEventsExportInformation = async (
  query: EventExportQueryType,
) => {
  try {
    await assertPermission("event:export");

    const { start, end, status, is_archived, event_type_id } =
      eventExportQuerySchema.parse(query);

    const [authUser, role, sapAreaCode, permissions] = await Promise.all([
      getAuthUser(),
      getDashboardRole(),
      getDashboardArea(),
      getActivePermissions(),
    ]);

    const accessFilter = getEventScopeFilter(permissions, {
      role: role as EventQueryType["role"],
      employee_id: authUser?.employeeId,
      sap_area_code: sapAreaCode ?? undefined,
    });

    const filter: Prisma.eventsWhereInput = {
      is_archived,
      ...(status && { current_status: status }),
      ...(event_type_id && { event_type_id }),
      ...((start || end) && {
        event_date: {
          ...(start && { gte: startOfDay(new Date(start)) }),
          ...(end && { lte: endOfDay(new Date(end)) }),
        },
      }),
      ...accessFilter,
    };

    const events = await eventService.getEvents({
      filter,
      sort: { created_at: "desc" },
      options: {
        include: {
          users: {
            select: { full_name: true, employee_id: true, group: true },
          },
          product: { select: { name: true } },
          event_type: { select: { title: true } },
          area: {
            select: {
              area_name: true,
              area: { select: { area_name: true, sap_area_code: true } },
            },
          },
          event_budgets: true,
          event_consultants: {
            include: {
              doctor: { select: { full_name: true, dr_child_id: true } },
              event_consultant_approvals: {
                select: { nth_engagement: true },
              },
            },
          },
          event_approvers: {
            orderBy: { created_at: "desc" },
            take: 1,
            select: { created_at: true },
          },
        },
      },
    });

    const rows: EventExportRow[] = (events ?? []).flatMap((event): EventExportRow[] => {
      const findBudget = (item: string) =>
        event.event_budgets.find((budget) => budget.item === item);

      const budgetTotal = (budget?: { unit: number; unit_cost: unknown }) =>
        budget ? budget.unit * Number(budget.unit_cost) : 0;

      const foodBudget = findBudget(eventBudgetItem.food);

      const totalBudget = event.event_budgets.reduce(
        (acc, budget) => acc + budget.unit * Number(budget.unit_cost),
        0,
      );
      const totalHonorarium = event.event_consultants.reduce(
        (acc, consultant) => acc + Number(consultant.honorarium ?? 0),
        0,
      );

      const base: Omit<
        EventExportRow,
        | "dr_child_id"
        | "dr_name"
        | "role"
        | "honorarium"
        | "h_words"
        | "nth_engagement"
      > = {
        track_no: event.track_no,
        work_area: event.area.area_name,
        employee_id: event.employee_id,
        full_name: event.users?.full_name ?? "-",
        group_name: event.users?.group ?? null,
        title: event.event_type?.title ?? event.type,
        product: event.product.name,
        event_title: event.title,
        rm_name: event.area.area?.area_name ?? null,
        rm_code: event.area.area?.sap_area_code ?? null,
        created_at: event.created_at,
        event_date: event.event_date,
        venue: event.venue,
        institute: event.institute,
        institute_dept: event.institute_dept,
        food_supplier: event.food_supplier,
        external_participants: event.external_participants,
        internal_participants: event.internal_participants,
        total_participants:
          event.internal_participants +
          event.external_participants +
          (event.other_participants ?? 0),
        venue_charge: budgetTotal(findBudget(eventBudgetItem.venue)),
        food_unit: foodBudget?.unit ?? 0,
        food_per_cost: foodBudget ? Number(foodBudget.unit_cost) : 0,
        food_cost: budgetTotal(foodBudget),
        transportation: budgetTotal(findBudget(eventBudgetItem.transportation)),
        projector: budgetTotal(findBudget(eventBudgetItem.projector)),
        sound_system: budgetTotal(findBudget(eventBudgetItem.sound)),
        other_cost: budgetTotal(findBudget(eventBudgetItem.other)),
        total_budget: totalBudget,
        total_eb_h: totalBudget + totalHonorarium,
        current_status: event.current_status,
        approval_date:
          event.current_status === "approved"
            ? (event.event_approvers[0]?.created_at ?? null)
            : null,
      };

      if (event.event_consultants.length === 0) {
        return [
          {
            ...base,
            dr_child_id: null,
            dr_name: null,
            role: null,
            honorarium: 0,
            h_words: "",
            nth_engagement: null,
          },
        ];
      }

      return event.event_consultants.map((consultant) => ({
        ...base,
        dr_child_id: consultant.doctor.dr_child_id,
        dr_name: consultant.doctor.full_name,
        role: consultant.role,
        honorarium: Number(consultant.honorarium ?? 0),
        h_words: "",
        nth_engagement:
          consultant.event_consultant_approvals?.nth_engagement ?? null,
      }));
    });

    return apiResponse.multi({ data: rows, count: rows.length });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
