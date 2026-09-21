import { approverService } from "@/services/approver";
import { areaService } from "@/services/area";
import { userService } from "@/services/user";
import { notifyMany, type NotifyInput } from "@/services/notify";
import ApproverRequestMail from "@/features/email/template/approver-mail";
import { formatDateTime } from "@/utils/formatter";
import type { Prisma } from "@/lib/generated/prisma/client";

// area type goes mio -> rm -> zm -> sm -> wing, so an event area has at most 4 parents
const AREA_MAX_DEPTH = 4;

// these roles are assigned by product, every other role is assigned by area
const PRODUCT_ROLES = ["ec", "marketing"];

const approverUserSelect = {
  employee_id: true,
  full_name: true,
  email: true,
} satisfies Prisma.usersSelect;

export type ApproverEvent = {
  event_type_id: string | null;
  product_id: string;
  sap_area_code: string;
};

export const getRoleLabel = (role: string) =>
  role.replace(/_/g, " ").toUpperCase();

const getParentAreaCode = async (sap_area_code: string) => {
  const area = await areaService.getAreaUniq({
    filter: { sap_area_code },
    options: { select: { parent_area_code: true } },
  });

  return area?.parent_area_code ?? null;
};

// event area followed by its parents, nearest first
const getAreaChain = async (sap_area_code: string) => {
  const chain: string[] = [];
  let code: string | null = sap_area_code;

  while (code && !chain.includes(code) && chain.length <= AREA_MAX_DEPTH) {
    chain.push(code);
    code = await getParentAreaCode(code);
  }

  return chain;
};

/**
 * Resolve the approver at `index` of the event type's approver chain
 * (0 = first approver) and the active users who hold that role for the event.
 * For area roles only the users of the nearest area that has one are returned.
 * Returns null when the event has no approver at that position.
 */
export const getNextApprover = async (event: ApproverEvent, index = 0) => {
  if (!event.event_type_id) return null;

  const approvers = await approverService.getApprovers({
    filter: { event_type_id: event.event_type_id },
    sort: { created_at: "asc" },
    skip: index,
    take: 1,
    cacheOption: { cache: false },
  });

  const approver = approvers?.[0];
  if (!approver) return null;

  const role = approver.user_type;
  const roleFilter: Prisma.usersWhereInput = {
    status: "active",
    users_role: { some: { role } },
  };

  if (PRODUCT_ROLES.includes(role)) {
    const users = await userService.getusers({
      filter: {
        ...roleFilter,
        user_product: { some: { product_id: event.product_id } },
      },
      options: { select: approverUserSelect },
      cacheOption: { cache: false },
    });

    return { approver, role, recipients: users ?? [] };
  }

  const chain = await getAreaChain(event.sap_area_code);
  const users = await userService.getusers({
    filter: {
      ...roleFilter,
      users_area: { some: { sap_area_code: { in: chain } } },
    },
    options: {
      select: {
        ...approverUserSelect,
        users_area: {
          where: { sap_area_code: { in: chain } },
          select: { sap_area_code: true },
        },
      },
    },
    cacheOption: { cache: false },
  });

  const withRank = (users ?? []).map(({ users_area, ...user }) => ({
    user,
    rank: Math.min(...users_area.map((a) => chain.indexOf(a.sap_area_code))),
  }));
  const nearest = Math.min(...withRank.map(({ rank }) => rank));

  return {
    approver,
    role,
    recipients: withRank
      .filter(({ rank }) => rank === nearest)
      .map(({ user }) => user),
  };
};

export type ApproverNotifyEvent = ApproverEvent & {
  id: string;
  title: string;
  event_date: Date;
  event_type?: { title: string } | null;
  users?: { full_name: string } | null;
};

/**
 * Email and send an "action" notification to the approver at `index` of the
 * event type's approver chain. Never throws: callers run it after the event
 * data is already saved, so a failure here is logged instead of failing them.
 */
export const notifyNextApprover = async (
  event: ApproverNotifyEvent,
  index = 0,
) => {
  try {
    const next = await getNextApprover(event, index);
    if (!next) return null;

    if (!next.recipients.length) {
      console.warn(
        `No active ${next.role} approver found for event ${event.id}`,
      );
      return next;
    }

    const approverRole = getRoleLabel(next.role);

    await notifyMany(
      next.recipients.map(
        (recipient): NotifyInput => ({
          recipient,
          event_id: event.id,
          message: `You have a new event proposal approval request as ${approverRole}`,
          is_marked: "no",
          status: "action",
          email: {
            subject: "New event approval request",
            html: ApproverRequestMail({
              approverName: recipient.full_name,
              approverRole,
              eventId: event.id,
              eventTitle: event.title,
              eventDate: formatDateTime(event.event_date),
              requestorName: event.users?.full_name,
              product: event.product_id.toUpperCase(),
              typeTitle: event.event_type?.title ?? "",
            }),
          },
        }),
      ),
    );

    return next;
  } catch (error) {
    console.error("Failed to notify approver", error);
    return null;
  }
};
