import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import z from "zod";

export const QuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE),
    size: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_SIZE),
    search: z.string().trim().optional(),
    sort: z.enum(['asc', 'desc']).optional(),
});

export type QuerySchemaType = z.infer<typeof QuerySchema>