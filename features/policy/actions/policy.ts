"use server";

import { apiResponse } from "@/lib/response";
import { CreatePolicyDTOType, UpdatePolicyDTOType } from "../schema/schema";
import { policyService } from "@/services/policy";
import { Prisma } from "@/lib/generated/prisma/client";

export const createPolicy = async (data: CreatePolicyDTOType) => {
  try {
    const { conditions, ...rest } = data;

    const res = await policyService.createPolicy({
      data: {
        ...rest,
        ...(conditions && { conditions: conditions as Prisma.InputJsonValue }),
      },
    });

    return apiResponse.single({
      data: res,
      message: "Policy created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updatePolicy = async (id: string, data: UpdatePolicyDTOType) => {
  try {
    const { conditions, ...rest } = data;

    const res = await policyService.updatePolicy({
      filter: { id },
      data: {
        ...rest,
        ...(conditions && { conditions: conditions as Prisma.InputJsonValue }),
      },
    });

    return apiResponse.single({
      data: res,
      message: "Policy updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deletePolicy = async (id: string) => {
  try {
    const res = await policyService.deletePolicy({ filter: { id } });

    return apiResponse.single({
      data: res,
      message: "Policy deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
