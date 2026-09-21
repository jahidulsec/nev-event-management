import "server-only";

import { cache } from "react";
import { getAuthUser, getDashboardRole } from "@/lib/dal";
import {
  ALL_PERMISSIONS,
  isPermission,
  Permission,
  SUPERADMIN_ROLE,
} from "@/lib/permissions";
import { permissionService } from "@/services/permission";

export const getActivePermissions = cache(async (): Promise<Permission[]> => {
  const [user, role] = await Promise.all([getAuthUser(), getDashboardRole()]);

  if (!user || !role || !user.role.includes(role)) return [];

  if (role === SUPERADMIN_ROLE) return [...ALL_PERMISSIONS];

  const granted = await permissionService.getPermissions({
    filter: { role },
    options: { select: { permission: true } },
  });

  // ignore rows that are no longer part of the catalog
  return (granted ?? []).map((item) => item.permission).filter(isPermission);
});

export const hasPermission = async (permission: Permission) =>
  (await getActivePermissions()).includes(permission);

/** Throws when the current role lacks the permission; use inside server actions. */
export const assertPermission = async (permission: Permission) => {
  if (!(await hasPermission(permission)))
    throw new Error("You do not have permission to perform this action");
};
