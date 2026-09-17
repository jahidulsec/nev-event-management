"use server";

import { apiResponse } from "@/lib/response";
import {
  CreateUserDTOType,
  createUsersDTOSchema,
  CreateUsersDTOType,
  UpdateUserDTOType,
} from "@/features/users/schema/schema";
import { userService } from "@/services/user";
import { hashPassword } from "@/utils/password";

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

export const upsertUsers = async (data: CreateUsersDTOType) => {
  try {
    const validatedData = createUsersDTOSchema.parse(data);

    if (validatedData.length === 0) throw new Error("No user data included");

    for (const i of validatedData) {
      const { roles, ...rest } = i;

      await userService.upsertUser({
        filter: {
          employee_id: i.employee_id,
        },

        data: {
          ...rest,
          password: await hashPassword(
            rest.password ?? process.env.DATABASE_PASSWORD!,
          ),
          users_role: {
            createMany: {
              data: roles.map((role) => ({ role })),
              skipDuplicates: true,
            },
          },
          status: "active",
        },
      });
    }

    return apiResponse.single({
      data: null,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
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
            create: roles.map((role) => ({ role })),
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
