import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const ProductSchema = z.object({
  name: z.string("Enter Mame").min(2, "name must be at least 2 characters."),
});

export const ProductQuerySchema = QuerySchema.extend({
  // participant_id: z.string().optional(),
});

export const ProductsSchema = z.array(
  ProductSchema.extend({
    slug: z.string().min(1),
  }),
);

export type ProductType = z.infer<typeof ProductSchema>;
export type ProductsType = z.infer<typeof ProductsSchema>;
export type ProductQueryType = z.infer<typeof ProductQuerySchema>;
