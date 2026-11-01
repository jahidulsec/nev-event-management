import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const areaType = z.enum(
  ["mio", "rm", "zm", "sm", "wing"],
  "Pick a area type",
);

export const createAreaDTOSchema = z.object({
  sap_area_code: z
    .string("Enter area code")
    .min(3, "At least 3 characters")
    .max(6, "not more than 6 character"),

  area_name: z
    .string("Enter area code")
    .min(3, "At least 3 characters")
    .max(30, "not more than 30 character"),

  parent_area_code: z
    .string("Enter area code")
    .min(3, "At least 3 characters")
    .max(6, "not more than 6 character")
    .optional(),

  type: areaType,
});

export const areaQuerySchema = QuerySchema.extend({});

export const updateAreaDTOSchema = createAreaDTOSchema.partial();

export type CreateAreaDTOType = z.infer<typeof createAreaDTOSchema>;
export type UpdateAreaDTOType = z.infer<typeof updateAreaDTOSchema>;
export type AreaQueryType = z.infer<typeof areaQuerySchema>;
