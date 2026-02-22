"use server";

import { db } from "@/config/db";
import { event_type, Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getCleanData } from "@/utils/formatter";
import { EventTypeQuerySchema, EventTypeQueryType } from "../actions/schema";
import { getSerializeData } from "@/utils/helper";

export type EventTypeMultiProps = Prisma.event_typeGetPayload<{
  include: { approver: true };
}>;

const getMulti = async (query: EventTypeQueryType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = EventTypeQuerySchema.parse(cleanData);

    // extract params
    const filter: Prisma.event_typeWhereInput = {
      ...(params.search && {
        title: {
          contains: params.search,
        },
      }),
    };

    const [data, count] = await Promise.all([
      db.event_type.findMany({
        where: filter,
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
        include: {
          approver: {
            select: {
              user_type: true,
              type: true,
            },
            orderBy: {
              type: "asc",
            },
          },
        },
      }),
      db.event_type.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<EventTypeMultiProps>({
      message: "Get event types successful",
      data: getSerializeData(data) as EventTypeMultiProps[],
      count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

const getSingle = async (id: string) => {
  try {
    const data = await db.event_type.findUnique({
      where: { id },
    });

    // if quiz does not exist, throw error
    if (!data) throw new Error("Data not found");

    return apiResponse.single<event_type>({
      message: "Get event type successful",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

export { getMulti as getEventTypes, getSingle as getEventType };
