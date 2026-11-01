import z from "zod";
import { isPermission, Permission } from "@/lib/permissions";

export const setRolePermissionsDTOSchema = z.object({
  role: z
    .string("Select a role")
    .min(1, "Select a role")
    .max(25, "not more than 25 character"),
  permissions: z.array(z.string().refine(isPermission, "Unknown permission")),
});

export type SetRolePermissionsDTOType = z.infer<
  typeof setRolePermissionsDTOSchema
>;

export type RolePermissionItem = {
  role: string;
  userCount: number;
  permissions: Permission[];
};
