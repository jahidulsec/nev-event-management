"use server";

import { apiResponse } from "@/lib/response";
import { isPermission, Permission } from "@/lib/permissions";
import { cacheTags } from "@/lib/server-cache";
import { permissionService } from "@/services/permission";
import { roleService } from "@/services/role";
import { RolePermissionItem } from "../schema/schema";

/** Every role with its user count and the permissions currently granted to it. */
export const getRolePermissions = async () => {
  try {
    const [roles, granted] = await Promise.all([
      roleService.getRoles({
        sort: { role: "asc" },
        options: {
          include: {
            _count: {
              select: { users_role_users_role_roleTorole: true },
            },
          },
        },
        // user counts change when users are assigned, so bust with user writes
        cacheOption: { tags: [cacheTags.users] },
      }),
      permissionService.getPermissions({
        options: { select: { role: true, permission: true } },
      }),
    ]);

    const byRole = new Map<string, Permission[]>();

    // ignore rows that are no longer part of the catalog
    for (const { role, permission } of granted ?? []) {
      if (!isPermission(permission)) continue;
      byRole.set(role, [...(byRole.get(role) ?? []), permission]);
    }

    const data: RolePermissionItem[] = (roles ?? []).map((item) => ({
      role: item.role,
      userCount: item._count.users_role_users_role_roleTorole,
      permissions: byRole.get(item.role) ?? [],
    }));

    return apiResponse.multi({ data, count: data.length });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
