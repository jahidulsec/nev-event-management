import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import { cachedRead, cacheTags } from "@/lib/server-cache";

/**
 * Read-only aggregates for the dashboard home page.
 *
 * Everything here returns plain JSON (numbers / ISO strings): `unstable_cache`
 * serializes results, so Dates, BigInts and Decimals must not leak out.
 */

export type EventStatus = "approved" | "processing" | "rework" | "rejected";
export type StatusCounts = Record<EventStatus, number>;

export type RankedRow = { label: string; total: number };
export type MonthlyStatusRow = {
  month: string;
  status: EventStatus;
  total: number;
};
export type MonthlyTotalRow = { month: string; total: number };

export type EventBrief = {
  id: string;
  title: string;
  status: EventStatus;
  eventDate: string;
  createdAt: string | null;
  venue: string;
  product: string;
  submittedBy: string | null;
};

export type ActivityKind = "submitted" | "approved" | "rejected" | "rework";
export type ActivityRow = {
  id: string;
  kind: ActivityKind;
  at: string;
  eventId: string;
  eventTitle: string;
  actor: string | null;
  actorRole: string | null;
  remarks: string | null;
};

export type DirectoryCounts = {
  users: number;
  doctors: number;
  products: number;
  areas: number;
  eventTypes: number;
};

// mutations on any of these should refresh the dashboard
const dashboardTags = [
  cacheTags.events,
  cacheTags.eventsCount,
  cacheTags.eventApprovers,
  cacheTags.eventStatusHistories,
  cacheTags.eventBudgets,
];

const read = <T>(fn: () => Promise<T>, key: string[]) =>
  cachedRead(fn, cacheTags.events, ["dashboard", ...key], {
    tags: dashboardTags,
  });

const notArchived: Prisma.eventsWhereInput = {
  OR: [{ is_archived: "no" }, { is_archived: null }],
};

/** Combines a caller's scope with the "hide archived events" default. */
export const withoutArchived = (
  scope: Prisma.eventsWhereInput = {},
): Prisma.eventsWhereInput => ({ AND: [scope, notArchived] });

const emptyCounts = (): StatusCounts => ({
  approved: 0,
  processing: 0,
  rework: 0,
  rejected: 0,
});

const eventBriefSelect = {
  id: true,
  title: true,
  event_date: true,
  created_at: true,
  venue: true,
  current_status: true,
  product: { select: { name: true } },
  users: { select: { full_name: true } },
} satisfies Prisma.eventsSelect;

type EventBriefRow = Prisma.eventsGetPayload<{
  select: typeof eventBriefSelect;
}>;

const toEventBrief = (row: EventBriefRow): EventBrief => ({
  id: row.id,
  title: row.title,
  status: row.current_status ?? "processing",
  eventDate: row.event_date.toISOString(),
  createdAt: row.created_at?.toISOString() ?? null,
  venue: row.venue,
  product: row.product.name,
  submittedBy: row.users?.full_name ?? null,
});

const getStatusCounts = (filter: Prisma.eventsWhereInput) =>
  read(
    async () => {
      const rows = await db.events.groupBy({
        by: ["current_status"],
        where: filter,
        _count: { _all: true },
      });

      const counts = emptyCounts();
      for (const row of rows)
        counts[row.current_status ?? "processing"] += row._count._all;

      return counts;
    },
    ["status-counts", JSON.stringify(filter)],
  );

const getEventBriefs = ({
  filter,
  sort,
  take,
  keyPart,
}: {
  filter: Prisma.eventsWhereInput;
  sort: Prisma.eventsOrderByWithRelationInput;
  take: number;
  keyPart: string;
}) =>
  read(
    async () => {
      const rows = await db.events.findMany({
        where: filter,
        orderBy: sort,
        take,
        select: eventBriefSelect,
      });

      return rows.map(toEventBrief);
    },
    [keyPart, JSON.stringify(filter), JSON.stringify(sort), String(take)],
  );

const getEventBriefCount = (filter: Prisma.eventsWhereInput, keyPart: string) =>
  read(() => db.events.count({ where: filter }), [
    keyPart,
    JSON.stringify(filter),
  ]);

/** Submissions per month and status since `since`. */
const getMonthlyStatusRows = (since: Date) =>
  read(
    async () => {
      const rows = await db.$queryRaw<
        { month: string; status: EventStatus | null; total: bigint }[]
      >`
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
               current_status AS status,
               COUNT(*) AS total
        FROM events
        WHERE created_at >= ${since}
          AND (is_archived IS NULL OR is_archived <> 'yes')
        GROUP BY month, current_status
      `;

      return rows.map(
        (row): MonthlyStatusRow => ({
          month: row.month,
          status: row.status ?? "processing",
          total: Number(row.total),
        }),
      );
    },
    ["monthly-status", since.toISOString()],
  );

/** Requested budget (sum of unit * unit cost) per month since `since`. */
const getMonthlyBudgetRows = (since: Date) =>
  read(
    async () => {
      const rows = await db.$queryRaw<{ month: string; total: unknown }[]>`
        SELECT DATE_FORMAT(e.created_at, '%Y-%m') AS month,
               COALESCE(SUM(b.unit * b.unit_cost), 0) AS total
        FROM event_budgets b
        JOIN events e ON e.id = b.event_id
        WHERE e.created_at >= ${since}
          AND (e.is_archived IS NULL OR e.is_archived <> 'yes')
        GROUP BY month
      `;

      return rows.map(
        (row): MonthlyTotalRow => ({
          month: row.month,
          total: Number(row.total),
        }),
      );
    },
    ["monthly-budget", since.toISOString()],
  );

const getTopEventTypes = (limit: number) =>
  read(
    async () => {
      const rows = await db.$queryRaw<{ label: string; total: bigint }[]>`
        SELECT et.title AS label, COUNT(*) AS total
        FROM events e
        JOIN event_type et ON et.id = e.event_type_id
        WHERE (e.is_archived IS NULL OR e.is_archived <> 'yes')
        GROUP BY et.id, et.title
        ORDER BY total DESC
        LIMIT ${limit}
      `;

      return rows.map(
        (row): RankedRow => ({ label: row.label, total: Number(row.total) }),
      );
    },
    ["top-event-types", String(limit)],
  );

const getTopProducts = (limit: number) =>
  read(
    async () => {
      const rows = await db.$queryRaw<{ label: string; total: bigint }[]>`
        SELECT p.name AS label, COUNT(*) AS total
        FROM events e
        JOIN product p ON p.id = e.product_id
        WHERE (e.is_archived IS NULL OR e.is_archived <> 'yes')
        GROUP BY p.id, p.name
        ORDER BY total DESC
        LIMIT ${limit}
      `;

      return rows.map(
        (row): RankedRow => ({ label: row.label, total: Number(row.total) }),
      );
    },
    ["top-products", String(limit)],
  );

/**
 * Events still in review, grouped by the approver they are waiting on. Mirrors
 * `eventService.getEventIdsByCurrentApprover`: the next approver is the first
 * (by creation order) configured approver of the event type that has not acted.
 */
const getPendingByApprover = () =>
  read(
    async () => {
      const rows = await db.$queryRaw<{ label: string; total: bigint }[]>`
        SELECT t.user_type AS label, COUNT(*) AS total
        FROM (
          SELECT
            e.id AS event_id,
            a.user_type,
            ROW_NUMBER() OVER (PARTITION BY e.id ORDER BY a.created_at ASC) AS rn
          FROM events e
          JOIN approver a ON a.event_type_id = e.event_type_id
          LEFT JOIN event_approvers ea
            ON ea.event_id = e.id AND ea.user_role = a.user_type
          WHERE ea.id IS NULL
            AND e.current_status = 'processing'
            AND (e.is_archived IS NULL OR e.is_archived <> 'yes')
        ) t
        WHERE t.rn = 1
        GROUP BY t.user_type
        ORDER BY total DESC
      `;

      return rows.map(
        (row): RankedRow => ({ label: row.label, total: Number(row.total) }),
      );
    },
    ["pending-by-approver"],
  );

const getDirectoryCounts = () =>
  read(
    async (): Promise<DirectoryCounts> => {
      const [users, doctors, products, areas, eventTypes] = await Promise.all([
        db.users.count(),
        db.doctor.count(),
        db.product.count(),
        db.area.count(),
        db.event_type.count(),
      ]);

      return { users, doctors, products, areas, eventTypes };
    },
    ["directory"],
  );

/** Latest submissions and approver decisions, newest first. */
const getRecentActivity = (limit: number) =>
  read(
    async () => {
      const [submitted, decisions] = await Promise.all([
        db.events.findMany({
          where: notArchived,
          orderBy: { created_at: "desc" },
          take: limit,
          select: {
            id: true,
            title: true,
            created_at: true,
            users: { select: { full_name: true } },
          },
        }),
        db.event_status_histories.findMany({
          orderBy: { created_at: "desc" },
          take: limit,
          select: {
            id: true,
            status: true,
            remarks: true,
            created_at: true,
            event_approvers: {
              select: {
                user_role: true,
                users: { select: { full_name: true } },
                events: { select: { id: true, title: true } },
              },
            },
          },
        }),
      ]);

      const rows: ActivityRow[] = [
        ...submitted.flatMap((row) =>
          row.created_at
            ? [
                {
                  id: `event-${row.id}`,
                  kind: "submitted" as const,
                  at: row.created_at.toISOString(),
                  eventId: row.id,
                  eventTitle: row.title,
                  actor: row.users?.full_name ?? null,
                  actorRole: null,
                  remarks: null,
                },
              ]
            : [],
        ),
        ...decisions.flatMap((row) =>
          row.created_at
            ? [
                {
                  id: `history-${row.id}`,
                  kind: row.status,
                  at: row.created_at.toISOString(),
                  eventId: row.event_approvers.events.id,
                  eventTitle: row.event_approvers.events.title,
                  actor: row.event_approvers.users?.full_name ?? null,
                  actorRole: row.event_approvers.user_role,
                  remarks: row.remarks,
                },
              ]
            : [],
        ),
      ];

      return rows
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, limit);
    },
    ["recent-activity", String(limit)],
  );

export const dashboardService = {
  getStatusCounts,
  getEventBriefs,
  getEventBriefCount,
  getMonthlyStatusRows,
  getMonthlyBudgetRows,
  getTopEventTypes,
  getTopProducts,
  getPendingByApprover,
  getDirectoryCounts,
  getRecentActivity,
};
