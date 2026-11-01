"use server";

import { assertPermission } from "@/lib/permission-guard";
import { SUPERADMIN_ROLE } from "@/lib/permissions";
import { apiResponse } from "@/lib/response";
import { permissionService } from "@/services/permission";
import {
  setRolePermissionsDTOSchema,
  SetRolePermissionsDTOType,
} from "../schema/schema";

export const setRolePermissions = async (data: SetRolePermissionsDTOType) => {
  try {
    await assertPermission("permission:manage");

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
