"use server";

import { apiResponse } from "@/lib/response";
import { Prisma } from "@/lib/generated/prisma/client";
import { eventConsultantApprovalService } from "@/services/event-consultant-approvers";

export type EventConsultantApprovalSingleProps =
  Prisma.event_consultant_approvalsGetPayload<{
    include: { event_consultants: true };
  }>;

export const getEventConsultantApproval = async (consultantId: string) => {
  try {
    const res = await eventConsultantApprovalService.getEventConsultantApprovalUniq(
      {
        filter: { consultant_Id: consultantId },
        options: { include: { event_consultants: true } },
      },
    );

    return apiResponse.single<EventConsultantApprovalSingleProps | null>({
      message: "Get event consultant approval successful",
      data: res,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getEventConsultantApprovals = async (eventId: string) => {
  try {
    const res = await eventConsultantApprovalService.getEventConsultantApprovals({
      filter: { event_consultants: { event_id: eventId } },
      sort: { created_at: "asc" },
      options: { include: { event_consultants: true } },
    });

    return apiResponse.multi<EventConsultantApprovalSingleProps>({
      message: "Get event consultant approvals successful",
      data: res ?? [],
      count: 0,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
