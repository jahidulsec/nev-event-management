"use server";

import { db } from "@/config/db";
import { event, Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getCleanData } from "@/utils/formatter";
import { EventQuerySchema, EventQueryType } from "../actions/schema";
import { getSerializeData } from "@/utils/helper";

export type EventMultiProps = Prisma.eventGetPayload<{
  include: {
    event_attachment: true;
    event_budget: true;
    event_consultant: true;
    event_type: {
      include: {
        approver: {
          orderBy: {
            created_at: "asc";
          };
        };
      };
    };
    user: {
      include: {
        user_details: true;
      };
    };
    product: true;
    event_approver: {
      include: {
        event_status_history: true;
      };
    };
  };
}>;

export type EventSingleProps = Prisma.eventGetPayload<{
  include: {
    event_attachment: true;
    event_budget: true;
    event_consultant: true;
    user: {
      include: { ao: true };
    };
  };
}>;

const getMulti = async (query: EventQueryType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = EventQuerySchema.parse(cleanData);

    // extract params
    const filter: Prisma.eventWhereInput = {
      ...(params.search && {
        title: {
          contains: params.search,
        },
      }),
      ...(params.work_area_code &&
        params.role === "ao" && {
          user_id: params.work_area_code,
        }),
      ...(params.role === "flm" &&
        params.work_area_code && {
          user: {
            ao: {
              rm_code: params.work_area_code,
            },
          },
        }),
      ...(params.role === "slm" &&
        params.work_area_code && {
          user: {
            ao: {
              zm_code: params.work_area_code,
            },
          },
        }),
      ...(params.role === "director" &&
        params.work_area_code && {
          user: {
            ao: {
              wing_code: params.work_area_code,
            },
          },
        }),
    };

    const [data, count] = await Promise.all([
      db.event.findMany({
        include: {
          event_attachment: true,
          event_budget: true,
          event_consultant: true,
          user: { include: { user_details: true } },
          product: true,
          event_type: {
            include: {
              approver: {
                orderBy: {
                  created_at: "asc",
                },
              },
            },
          },
          event_approver: {
            include: {
              event_status_history: {
                orderBy: {
                  created_at: "desc",
                },
              },
            },
            orderBy: {
              created_at: "desc",
            },
          },
        },
        where: filter,
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
      }),
      db.event.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<EventMultiProps>({
      message: "Get events successful",
      data: getSerializeData(data) as EventMultiProps[],
      count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

const getSingle = async (id: string) => {
  try {
    const data = await db.event.findUnique({
      where: { id },
      include: {
        event_attachment: true,
        event_budget: true,
        event_consultant: true,
        user: {
          include: {
            ao: true,
          },
        },
      },
    });

    // if quiz does not exist, throw error
    if (!data) throw new Error("Data not found");

    return apiResponse.single<EventSingleProps>({
      message: "Get event successful",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

export { getMulti as getEvents, getSingle as getEvent };
