"use server";

import { apiResponse } from "@/lib/response";
import { userQuerySchema, UserQueryType } from "@/features/user/schema/schema";
import { userService } from "@/services/user";
import { Prisma } from "@/lib/generated/prisma/client";
import { ServerCacheOptions } from "@/lib/server-cache";

export type UserMultiProps = Prisma.usersGetPayload<{}>;

export const getUsers = async (query: UserQueryType) => {
  try {
    const { page, size, search } = userQuerySchema.parse(query);

    const filter: Prisma.usersWhereInput = {
      ...(search && {
        OR: [
          {
            employee_id: {
              startsWith: search,
            },
          },
          {
            full_name: {
              startsWith: search,
            },
          },
          {
            email: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      userService.getusers({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          employee_id: "asc",
        },
      }),
      userService.getuserCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getUser = async (
  id: string,
  revalidate?: ServerCacheOptions["revalidate"],
) => {
  try {
    const [res] = await Promise.all([
      userService.getUserUniq({
        filter: {
          employee_id: id,
        },
        cacheOption: {
          revalidate: revalidate,
        },
      }),
    ]);

    return apiResponse.single({ data: res, message: "GET user successful" });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
