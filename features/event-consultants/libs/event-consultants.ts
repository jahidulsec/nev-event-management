"use server";

import { apiResponse } from "@/lib/response";
import { Prisma } from "@/lib/generated/prisma/client";
import { eventConsultantService } from "@/services/event-consultants";

export type EventConsultantMultiProps = Prisma.event_consultantsGetPayload<{
  include: {
    doctor: true;
    event_consultant_approvals: true;
  };
}>;

export const getEventConsultants = async (eventId: string) => {
  try {
    const res = await eventConsultantService.getEventConsultants({
      filter: {
        event_id: eventId,
      },
      sort: {
        created_at: "asc",
      },
      options: {
        include: {
          doctor: true,
          event_consultant_approvals: true,
        },
      },
    });

    return apiResponse.multi<EventConsultantMultiProps>({
      message: "Get event consultants successful",
      data: res ?? [],
      count: 0,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
