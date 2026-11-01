import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const createUserAreaDTOSchema = z.object({
  employee_id: z.string("Select user").min(1, "Select a user"),

  sap_area_code: z.string("Select area").min(1, "Select an area"),
});

export const userAreaQuerySchema = QuerySchema.extend({});

export const updateUserAreaDTOSchema = createUserAreaDTOSchema.partial();
export const createUserAreasDTOSchema = z.array(createUserAreaDTOSchema);

export type CreateUserAreaDTOType = z.infer<typeof createUserAreaDTOSchema>;
export type CreateUserAreasDTOType = z.infer<typeof createUserAreasDTOSchema>;
export type UpdateUserAreaDTOType = z.infer<typeof updateUserAreaDTOSchema>;
export type UserAreaQueryType = z.infer<typeof userAreaQuerySchema>;
