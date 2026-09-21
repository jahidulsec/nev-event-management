"use server";

import { getAuthUser } from "@/lib/dal";
import { SUPERADMIN_ROLE } from "@/lib/permissions";
import { apiResponse } from "@/lib/response";
import { permissionService } from "@/services/permission";
import {
  setRolePermissionsDTOSchema,
  SetRolePermissionsDTOType,
} from "../schema/schema";

// Checks the signed session rather than the switchable dashboard-role cookie.
// TODO: replace with the shared permission guard once it exists.
const assertSuperadmin = async () => {
  const user = await getAuthUser();

  if (!user?.role.includes(SUPERADMIN_ROLE))
    throw new Error("You do not have permission to manage permissions");
};

export const setRolePermissions = async (data: SetRolePermissionsDTOType) => {
  try {
    await assertSuperadmin();

    const { role, permissions } = setRolePermissionsDTOSchema.parse(data);

    // superadmin always has full access, so its grants are not editable
    if (role === SUPERADMIN_ROLE)
      throw new Error("Superadmin has full access and cannot be edited");

    const unique = [...new Set(permissions)];

    await permissionService.replaceRolePermissions({
      role,
      permissions: unique,
    });

    return apiResponse.single({
      data: { role, permissions: unique },
      message: `Permissions updated for ${role}`,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
