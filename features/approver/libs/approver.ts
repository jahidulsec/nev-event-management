"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { apiResponse } from "@/lib/response";
import { approverService } from "@/services/approver";
import { getCleanData } from "@/utils/formatter";
import { getSerializeData } from "@/utils/helper";
import { approverQuerySchema, ApproverQueryType } from "../schema/schema";

export type ApproverMultiProps = Prisma.approverGetPayload<{
  include: { event_type: true };
}>;

export const getApprovers = async (query: ApproverQueryType) => {
  try {
    const { page, size, search, sort, type_id } = approverQuerySchema.parse(
      getCleanData(query),
    );

    const filter: Prisma.approverWhereInput = {
      ...(search && {
        event_type: {
          title: {
            contains: search,
          },
        },
      }),
      ...(type_id && {
        event_type_id: type_id,
      }),
    };

    const [res, count] = await Promise.all([
      approverService.getApprovers({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          created_at: sort ?? "desc",
        },
        options: {
          include: { event_type: true },
        },
      }),
      approverService.getApproverCount({ filter }),
    ]);

    return apiResponse.multi<ApproverMultiProps>({
      message: "Get event type approvers successful",
      data: getSerializeData(res ?? []) as ApproverMultiProps[],
      count,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getApprover = async (id: string) => {
  try {
    const res = await approverService.getApproverUniq({
      filter: { id },
    });

    if (!res) throw new Error("Data not found");

    return apiResponse.single({
      message: "Get event type approver successful",
      data: res,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

/** All approvers of an event type, oldest first (used to draw the approval flow). */
export const getApproverList = async (eventTypeId: string) => {
  try {
    const res = await approverService.getApprovers({
      filter: { event_type_id: eventTypeId },
      sort: { created_at: "asc" },
    });

    return apiResponse.multi({
      message: "GET successful",
      data: res ?? [],
      count: res?.length ?? 0,
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
