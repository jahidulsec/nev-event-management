import { yesNoEnum } from "@/schemas/common";
import z from "zod";

export const createECApprovalPayloadSchema = z.object({
  consultant_id: z.string(),
  ec_id: z.string(),
  honorarium_check: yesNoEnum,
  consultant_form_attached: yesNoEnum,
  nth_engagement: z
    .number("Enter a positive number")
    .int("Enter a whole number")
    .positive("Enter a positive number"),
});

export type CreateECApprovalPayloadType = z.infer<
  typeof createECApprovalPayloadSchema
>;
