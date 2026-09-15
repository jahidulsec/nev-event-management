"use server";

import { apiResponse } from "@/lib/response";
import { policyQuerySchema, PolicyQueryType } from "../schema/schema";
import { policyService } from "@/services/policy";
import { Prisma } from "@/lib/generated/prisma/client";

export const getPolicies = async (query: PolicyQueryType) => {
  try {
    const { page, size, search } = policyQuerySchema.parse(query);

    const filter: Prisma.policyWhereInput = {
      ...(search && {
        OR: [
          { name: { startsWith: search } },
          { resource: { startsWith: search } },
          { action: { startsWith: search } },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      policyService.getPolicies({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          priority: "desc",
        },
      }),
      policyService.getPolicyCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getPolicy = async (id: string) => {
  try {
    const [res] = await Promise.all([
      policyService.getPolicyUniq({
        filter: {
          id,
        },
      }),
    ]);

    return apiResponse.single({
      data: res,
      message: "GET policy successful",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
