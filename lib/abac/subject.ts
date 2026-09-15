import { cache } from "react";
import { db } from "@/config/db";

export type AbacSubject = {
  employeeId: string;
  roles: string[];
  areas: string[];
  products: string[];
  designation?: string;
  group?: string;
};

export const EMPTY_SUBJECT: AbacSubject = {
  employeeId: "",
  roles: [],
  areas: [],
  products: [],
};

/**
 * Reads the given employee's roles/areas/products from the existing
 * users_role/users_area/user_product tables (read-only, no schema change).
 * Wrapped in React's cache() so repeated calls within one request are deduped.
 */
export const getSubjectAttributes = cache(
  async (employeeId: string): Promise<AbacSubject> => {
    if (!employeeId) return EMPTY_SUBJECT;

    const user = await db.users.findUnique({
      where: { employee_id: employeeId },
      include: { users_role: true, users_area: true, user_product: true },
    });

    if (!user) return EMPTY_SUBJECT;

    return {
      employeeId: user.employee_id,
      roles: user.users_role.map((r) => r.role),
      areas: user.users_area.map((a) => a.sap_area_code),
      products: user.user_product.map((p) => p.product_id),
      designation: user.designation,
      group: user.group ?? undefined,
    };
  },
);
