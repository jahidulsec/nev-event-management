import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const eventAttachmentBaseSchema = z.object({
  event_id: z.string("Select an event").optional(),

  document_title: z
    .string("Enter document title")
    .min(2, "At least 2 characters")
    .max(100, "not more than 100 character"),

  file: z
    .instanceof(File, { message: "Upload a valid file" })
    .refine(
      (file) =>
        [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ].includes(file.type),
      "Upload pdf, image only",
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be under 5MB",
    })
    .optional(),

  file_path: z
    .string("Enter file path")
    .max(200, "not more than 200 character")
    .optional(),
});

export const createEventAttachmentDTOSchema = eventAttachmentBaseSchema.superRefine(
  (data, ctx) => {
    if (!data.file_path && !data.file) {
      ctx.addIssue({
        path: ["file"],
        message: "File is required",
        code: z.ZodIssueCode.custom,
      });
    }
  },
);

export const updateEventAttachmentDTOSchema = eventAttachmentBaseSchema.partial();

export const eventAttachmentQuerySchema = QuerySchema.extend({
  event_id: z.string().optional(),
});

export type CreateEventAttachmentDTOType = z.infer<
  typeof createEventAttachmentDTOSchema
>;
export type UpdateEventAttachmentDTOType = z.infer<
  typeof updateEventAttachmentDTOSchema
>;
export type EventAttachmentQueryType = z.infer<
  typeof eventAttachmentQuerySchema
>;
