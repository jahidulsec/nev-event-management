"use server";

import { apiResponse } from "@/lib/response";
import { Prisma } from "@/lib/generated/prisma/client";
import { eventApproverService } from "@/services/event-approvers";

export type EventApproverMultiProps = Prisma.event_approversGetPayload<{
  include: {
    users: {
      select: {
        full_name: true;
        designation: true;
      };
    };
  };
}>;

export const getEventApprovers = async (eventId: string) => {
  try {
    const res = await eventApproverService.getEventApprovers({
      filter: {
        event_id: eventId,
      },
      sort: {
        created_at: "asc",
      },
      options: {
        include: {
          users: {
            select: {
              full_name: true,
              designation: true,
            },
          },
        },
      },
    });

    return apiResponse.multi<EventApproverMultiProps>({
      message: "Get event approvers successful",
      data: res ?? [],
      count: 0,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
