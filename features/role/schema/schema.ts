import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const createRoleDTOSchema = z.object({
  role: z
    .string("Enter role")
    .min(3, "At least 3 characters")
    .max(25, "not more than 25 character"),
});

export const roleQuerySchema = QuerySchema.extend({});

export const updateRoleDTOSchema = createRoleDTOSchema.partial();

export type CreateRoleDTOType = z.infer<typeof createRoleDTOSchema>;
export type UpdateRoleDTOType = z.infer<typeof updateRoleDTOSchema>;
export type RoleQueryType = z.infer<typeof roleQuerySchema>;
