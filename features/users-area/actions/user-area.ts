"use server";

import { apiResponse } from "@/lib/response";
import {
  CreateUserAreaDTOType,
  createUserAreasDTOSchema,
  CreateUserAreasDTOType,
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

export const upsertUserAreas = async (data: CreateUserAreasDTOType) => {
  try {
    const validatedData = createUserAreasDTOSchema.parse(data);

    if (validatedData.length === 0)
      throw new Error("No user area data included");

    for (const i of validatedData) {
      const { employee_id, sap_area_code } = i;

      await userAreaService.upsetUserArea({
        filter: {
          sap_area_code_employee_id: {
            employee_id,
            sap_area_code,
          },
        },

        data: {
          employee_id,
          sap_area_code,
        },
      });
    }

    return apiResponse.single({
      data: null,
      message: "User areas created successfully",
    });
  } catch (error) {
    console.log(error);
    return apiResponse.error({ error });
  }
};
