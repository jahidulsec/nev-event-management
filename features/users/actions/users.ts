"use server";

import { apiResponse } from "@/lib/response";
import {
  CreateUserDTOType,
  UpdateUserDTOType,
} from "@/features/users/schema/schema";
import { userService } from "@/services/user";
import { hashPassword } from "@/utils/password";
import { randomBytes } from "crypto";

const generateId = () => randomBytes(5).toString("hex");



export const createUser = async (data: CreateUserDTOType) => {
  try {
    const { roles, ...rest } = data;

    const res = await userService.createUser({
      data: {
        ...rest,
        password: await hashPassword(rest.password),
        users_role: {
          createMany: { data: roles.map((role) => ({ role })) },
        },
      },
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
    const { roles, ...rest } = data;

    const res = await userService.updateUser({
      filter: { employee_id: id },
      data: {
        ...rest,
        ...(rest.password && { password: await hashPassword(rest.password) }),
        ...(roles && {
          users_role: {
            deleteMany: {},
            create: roles.map((role) => ({ id: generateId(), role })),
          },
        }),
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
