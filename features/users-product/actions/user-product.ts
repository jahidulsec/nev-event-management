"use server";

import { apiResponse } from "@/lib/response";
import {
  CreateUserProductDTOType,
  CreateUserProductsDTOType,
  createUserProductsDTOSchema,
  UpdateUserProductDTOType,
} from "@/features/users-product/schema/schema";
import { userProductService } from "@/services/user-product";

export const createUserProduct = async (data: CreateUserProductDTOType) => {
  try {
    const res = await userProductService.createUserProduct({ data });

    return apiResponse.single({
      data: res,
      message: "User product created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateUserProduct = async (
  id: string,
  data: UpdateUserProductDTOType,
) => {
  try {
    const res = await userProductService.updateUserProduct({
      filter: { id },
      data,
    });

    return apiResponse.single({
      data: res,
      message: "User product updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteUserProduct = async (id: string) => {
  try {
    const res = await userProductService.deleteUserProduct({
      filter: { id },
    });

    return apiResponse.single({
      data: res,
      message: "User product deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const upsertUserProducts = async (data: CreateUserProductsDTOType) => {
  try {
    const validatedData = createUserProductsDTOSchema.parse(data);

    if (validatedData.length === 0)
      throw new Error("No user product data included");

    for (const { employee_id, product_id } of validatedData) {
      await userProductService.upsertUserProduct({
        filter: {
          employee_id_product_id: { employee_id, product_id },
        },
        data: { employee_id, product_id },
      });
    }

    return apiResponse.single({
      data: null,
      message: "User products saved successfully",
    });
  } catch (error) {
    console.log(error);
    return apiResponse.error({ error });
  }
};
