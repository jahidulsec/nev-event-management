import { yesNoEnum } from "@/schemas/common";
import z from "zod";

export const createFirstApproverApprovalPayloadSchema = z.object({
  consultant_id: z.string(),
  first_approver_id: z.string(),
  topic_expert: yesNoEnum,
  is_suitable: yesNoEnum,
});

export type CreateFirstApproverApprovalPayloadType = z.infer<
  typeof createFirstApproverApprovalPayloadSchema
>;
