import "server-only";

import { addMonths, format, startOfDay, startOfMonth, subMonths } from "date-fns";
import { getEventScopeFilter } from "@/features/events/utils/access";
import { getDashboardRole } from "@/lib/dal";
import { getActivePermissions } from "@/lib/permission-guard";
import { SUPERADMIN_ROLE } from "@/lib/permissions";
import { apiResponse } from "@/lib/response";
import {
  ActivityRow,
  dashboardService,
  DirectoryCounts,
  EventBrief,
  RankedRow,
  StatusCounts,
  withoutArchived,
} from "@/services/dashboard";
import { eventService } from "@/services/events";
import { getTitleCase } from "@/utils/formatter";
import { EventQueryType } from "@/features/events/schemas/events";

const TREND_MONTHS = 6;
const RANK_LIMIT = 5;
const LIST_LIMIT = 5;
const ACTIVITY_LIMIT = 5;

export type MonthBucket = StatusCounts & {
  key: string;
  label: string;
  total: number;
};

export type AdminDashboardData = {
  totals: StatusCounts;
  total: number;
  /** oldest -> newest, always `TREND_MONTHS` long (empty months are zero) */
  months: MonthBucket[];
  budget: { monthly: number[]; thisMonth: number; lastMonth: number };
  byType: RankedRow[];
  byProduct: RankedRow[];
  waitingOn: RankedRow[];
  directory: DirectoryCounts;
  activity: ActivityRow[];
  upcoming: EventBrief[];
};

export type UserDashboardData = {
  canViewEvents: boolean;
  canApprove: boolean;
  stats: StatusCounts;
  total: number;
  awaiting: { count: number; items: EventBrief[] };
  rework: { count: number; items: EventBrief[] };
  upcoming: EventBrief[];
};

export const sumCounts = (counts: StatusCounts) =>
  counts.approved + counts.processing + counts.rework + counts.rejected;

export const getAdminDashboard = async () => {
  try {
    if ((await getDashboardRole()) !== SUPERADMIN_ROLE)
      throw new Error("You do not have permission to view this dashboard");

    const now = new Date();
    const since = startOfMonth(subMonths(now, TREND_MONTHS - 1));
    const scope = withoutArchived();

    const [
      totals,
      statusRows,
      budgetRows,
      byType,
      byProduct,
      waitingOn,
      directory,
      activity,
      upcoming,
    ] = await Promise.all([
      dashboardService.getStatusCounts(scope),
      dashboardService.getMonthlyStatusRows(since),
      dashboardService.getMonthlyBudgetRows(since),
      dashboardService.getTopEventTypes(RANK_LIMIT),
      dashboardService.getTopProducts(RANK_LIMIT),
      dashboardService.getPendingByApprover(),
      dashboardService.getDirectoryCounts(),
      dashboardService.getRecentActivity(ACTIVITY_LIMIT),
      dashboardService.getEventBriefs({
        filter: {
          AND: [
            scope,
            { event_date: { gte: startOfDay(now) } },
            { current_status: { not: "rejected" } },
          ],
        },
        sort: { event_date: "asc" },
        take: LIST_LIMIT,
        keyPart: "upcoming",
      }),
    ]);

    const months: MonthBucket[] = Array.from(
      { length: TREND_MONTHS },
      (_, index) => {
        const date = addMonths(since, index);
        return {
          key: format(date, "yyyy-MM"),
          label: format(date, "MMM"),
          approved: 0,
          processing: 0,
          rework: 0,
          rejected: 0,
          total: 0,
        };
      },
    );

    for (const row of statusRows) {
      const bucket = months.find((month) => month.key === row.month);
      if (!bucket) continue;
      bucket[row.status] += row.total;
      bucket.total += row.total;
    }

    const budgetMonthly = months.map(
      (month) => budgetRows.find((row) => row.month === month.key)?.total ?? 0,
    );

    return apiResponse.single<AdminDashboardData>({
      data: {
        totals,
        total: sumCounts(totals),
        months,
        budget: {
          monthly: budgetMonthly,
          thisMonth: budgetMonthly.at(-1) ?? 0,
          lastMonth: budgetMonthly.at(-2) ?? 0,
        },
        byType: byType.map((row) => ({
          ...row,
          label: getTitleCase(row.label),
        })),
        byProduct: byProduct.map((row) => ({
          ...row,
          label: getTitleCase(row.label),
        })),
        waitingOn,
        directory,
        activity,
        upcoming,
      },
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

const emptyUserDashboard = (): UserDashboardData => ({
  canViewEvents: false,
  canApprove: false,
  stats: { approved: 0, processing: 0, rework: 0, rejected: 0 },
  total: 0,
  awaiting: { count: 0, items: [] },
  rework: { count: 0, items: [] },
  upcoming: [],
});

export const getUserDashboard = async ({
  role,
  employeeId,
  sapAreaCode,
}: {
  role?: EventQueryType["role"];
  employeeId?: string;
  sapAreaCode?: string;
}) => {
  try {
    const permissions = await getActivePermissions();

    if (!permissions.includes("event:view"))
      return apiResponse.single<UserDashboardData>({
        data: emptyUserDashboard(),
      });

    const canApprove = permissions.includes("event:approve");

    // same visibility rules as the events list
    const scope = withoutArchived(
      getEventScopeFilter(permissions, {
        role,
        employee_id: employeeId,
        sap_area_code: sapAreaCode,
      }),
    );

    // events whose next approver is this user's role
    const awaitingIds =
      canApprove && role
        ? await eventService.getEventIdsByCurrentApprover({ role })
        : [];

    const awaitingFilter = {
      AND: [scope, { current_status: "processing" as const }, { id: { in: awaitingIds } }],
    };

    // events this user submitted that were sent back to them
    const reworkFilter = {
      AND: [
        withoutArchived(),
        { employee_id: employeeId ?? "" },
        { current_status: "rework" as const },
      ],
    };

    const [stats, awaitingCount, awaitingItems, reworkCount, reworkItems, upcoming] =
      await Promise.all([
        dashboardService.getStatusCounts(scope),
        awaitingIds.length
          ? dashboardService.getEventBriefCount(awaitingFilter, "awaiting-count")
          : 0,
        awaitingIds.length
          ? dashboardService.getEventBriefs({
              filter: awaitingFilter,
              sort: { created_at: "asc" },
              take: LIST_LIMIT,
              keyPart: "awaiting",
            })
          : [],
        employeeId
          ? dashboardService.getEventBriefCount(reworkFilter, "rework-count")
          : 0,
        employeeId
          ? dashboardService.getEventBriefs({
              filter: reworkFilter,
              sort: { updated_at: "desc" },
              take: LIST_LIMIT,
              keyPart: "rework",
            })
          : [],
        dashboardService.getEventBriefs({
          filter: {
            AND: [
              scope,
              { event_date: { gte: startOfDay(new Date()) } },
              { current_status: { not: "rejected" } },
            ],
          },
          sort: { event_date: "asc" },
          take: LIST_LIMIT,
          keyPart: "upcoming",
        }),
      ]);

    return apiResponse.single<UserDashboardData>({
      data: {
        canViewEvents: true,
        canApprove,
        stats,
        total: sumCounts(stats),
        awaiting: { count: awaitingCount, items: awaitingItems },
        rework: { count: reworkCount, items: reworkItems },
        upcoming,
      },
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
