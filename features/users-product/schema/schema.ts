import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const createUserProductDTOSchema = z.object({
  employee_id: z.string("Select user").min(1, "Select a user"),

  product_id: z.string("Select product").min(1, "Select a product"),
});

export const userProductQuerySchema = QuerySchema.extend({});

export const updateUserProductDTOSchema = createUserProductDTOSchema.partial();
export const createUserProductsDTOSchema = z.array(createUserProductDTOSchema);

export type CreateUserProductDTOType = z.infer<typeof createUserProductDTOSchema>;
export type CreateUserProductsDTOType = z.infer<typeof createUserProductsDTOSchema>;
export type UpdateUserProductDTOType = z.infer<typeof updateUserProductDTOSchema>;
export type UserProductQueryType = z.infer<typeof userProductQuerySchema>;
