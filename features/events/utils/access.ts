import { Prisma } from "@/lib/generated/prisma/client";
import { Permission } from "@/lib/permissions";
import { EventQueryType } from "../schemas/events";

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

type EventAccessQuery = Pick<
  EventQueryType,
  "role" | "employee_id" | "sap_area_code"
>;

export const getEventAccessFilter = ({
  role,
  employee_id,
  sap_area_code,
}: EventAccessQuery): Prisma.eventsWhereInput => {
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

/** `event:view_all` bypasses the area/product scope. */
export const getEventScopeFilter = (
  permissions: readonly Permission[],
  query: EventAccessQuery,
): Prisma.eventsWhereInput =>
  permissions.includes("event:view_all") ? {} : getEventAccessFilter(query);
