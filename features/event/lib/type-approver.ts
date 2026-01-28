"use server";

import { db } from "@/config/db";
import { approver, Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getCleanData } from "@/utils/formatter";
import {
  EventTypeApproverQuerySchema,
  EventTypeApproverQueryType,
} from "../actions/schema";
import { getSerializeData } from "@/utils/helper";

export type ApproverMultiProps = Prisma.approverGetPayload<{
  include: { event_type: true };
}>;

const getMulti = async (query: EventTypeApproverQueryType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = EventTypeApproverQuerySchema.parse(cleanData);

    // extract params
    const filter: Prisma.approverWhereInput = {
      ...(params.search && {
        event_type: {
          title: {
            contains: params.search,
          },
        },
      }),
    };

    const [data, count] = await Promise.all([
      db.approver.findMany({
        include: {
          event_type: true,
        },
        where: filter,
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
      }),
      db.approver.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<ApproverMultiProps>({
      message: "Get event type approvers successful",
      data: data,
      count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

const getSingle = async (id: string) => {
  try {
    const data = await db.approver.findUnique({
      where: { id },
    });

    // if quiz does not exist, throw error
    if (!data) throw new Error("Data not found");

    return apiResponse.single<approver>({
      message: "Get event type approver successful",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

export { getMulti as getEventTypeApprovers, getSingle as getEventTypeApprover };
