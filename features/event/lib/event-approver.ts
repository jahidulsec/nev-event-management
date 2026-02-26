"use server";

import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";

export type EventApproverMultProps = Prisma.event_approverGetPayload<{
  include: {
    user: {
      select: {
        ao: {
          select: {
            full_name: true;
            designation: true;
          };
        };
        flm: {
          select: {
            full_name: true;
            designation: true;
          };
        };
        slm: {
          select: {
            full_name: true;
            designation: true;
          };
        };
        marketing: {
          select: {
            full_name: true;
            designation: true;
          };
        };
        ec: {
          select: {
            full_name: true;
            designation: true;
          };
        };
        franchise_head: {
          select: {
            full_name: true;
            designation: true;
          };
        };
      };
    };
  };
}>;

export const getEventApprovers = async (eventId: string) => {
  try {
    const res = await db.event_approver.findMany({
      where: {
        event_id: eventId,
      },
      include: {
        user: {
          select: {
            ao: {
              select: {
                full_name: true,
                designation: true,
              },
            },
            flm: {
              select: {
                full_name: true,
                designation: true,
              },
            },
            slm: {
              select: {
                full_name: true,
                designation: true,
              },
            },
            marketing: {
              select: {
                full_name: true,
                designation: true,
              },
            },
            ec: {
              select: {
                full_name: true,
                designation: true,
              },
            },
            franchise_head: {
              select: {
                full_name: true,
                designation: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return apiResponse.multi<EventApproverMultProps>({
      message: "Data get successful",
      data: res,
      count: 0,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
