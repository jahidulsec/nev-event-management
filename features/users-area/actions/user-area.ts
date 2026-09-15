"use server";

import { apiResponse } from "@/lib/response";
import {
  CreateUserAreaDTOType,
  UpdateUserAreaDTOType,
} from "@/features/users-area/schema/schema";
import { userAreaService } from "@/services/user-area";

export const createUserArea = async (data: CreateUserAreaDTOType) => {
  try {
    const res = await userAreaService.createUserArea({ data });

    return apiResponse.single({
      data: res,
      message: "User area created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateUserArea = async (
  id: string,
  data: UpdateUserAreaDTOType,
) => {
  try {
    const res = await userAreaService.updateUserArea({
      filter: { id },
      data,
    });

    return apiResponse.single({
      data: res,
      message: "User area updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteUserArea = async (id: string) => {
  try {
    const res = await userAreaService.deleteUserArea({
      filter: { id },
    });

    return apiResponse.single({
      data: res,
      message: "User area deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
