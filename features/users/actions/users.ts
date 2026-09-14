"use server";

import { apiResponse } from "@/lib/response";
import { CreateUserDTOType, UpdateUserDTOType } from "@/features/user/schema/schema";
import { userService } from "@/services/user";
import { hashPassword } from "@/utils/password";

export const createUser = async (data: CreateUserDTOType) => {
  try {
    const res = await userService.createUser({
      data: { ...data, password: await hashPassword(data.password) },
    });

    return apiResponse.single({
      data: res,
      message: "User created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateUser = async (id: string, data: UpdateUserDTOType) => {
  try {
    const res = await userService.updateUser({
      filter: { employee_id: id },
      data: {
        ...data,
        ...(data.password && { password: await hashPassword(data.password) }),
      },
    });

    return apiResponse.single({
      data: res,
      message: "User updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await userService.deleteUser({ filter: { employee_id: id } });

    return apiResponse.single({
      data: res,
      message: "User deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
