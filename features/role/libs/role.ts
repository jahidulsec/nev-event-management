"use server";

import { apiResponse } from "@/lib/response";
import { roleQuerySchema, RoleQueryType } from "../schema/schema";
import { roleService } from "@/services/role";
import { Prisma } from "@/lib/generated/prisma/client";

export const getRoles = async (query: RoleQueryType) => {
  try {
    const { page, size, search } = roleQuerySchema.parse(query);

    const filter: Prisma.roleWhereInput = {
      ...(search && {
        OR: [
          {
            role: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      roleService.getRoles({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          role: "asc",
        },
      }),
      roleService.getRoleCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getRole = async (id: string) => {
  try {
    const [res] = await Promise.all([
      roleService.getRoleUniq({
        filter: {
          role: id,
        },
      }),
    ]);

    return apiResponse.single({ data: res, message: "GET role successful" });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
