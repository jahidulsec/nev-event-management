"use server";

import { apiResponse } from "@/lib/response";
import {
  userAreaQuerySchema,
  UserAreaQueryType,
} from "@/features/users-area/schema/schema";
import { userAreaService } from "@/services/user-area";
import { Prisma } from "@/lib/generated/prisma/client";
import { ServerCacheOptions } from "@/lib/server-cache";

export type UserAreaMultiProps = Prisma.users_areaGetPayload<{
  include: { area: true; users: true };
}>;

export const getUserAreas = async (query: UserAreaQueryType) => {
  try {
    const { page, size, search } = userAreaQuerySchema.parse(query);

    const filter: Prisma.users_areaWhereInput = {
      ...(search && {
        OR: [
          {
            employee_id: {
              startsWith: search,
            },
          },
          {
            users: {
              full_name: { contains: search },
            },
          },
          {
            sap_area_code: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      userAreaService.getUserAreas({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          id: "desc",
        },
        options: { include: { area: true, users: true } },
      }),
      userAreaService.getUserAreaCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getUserArea = async (
  id: string,
  revalidate?: ServerCacheOptions["revalidate"],
) => {
  try {
    const [res] = await Promise.all([
      userAreaService.getUserAreaUniq({
        filter: {
          id,
        },
        cacheOption: {
          revalidate: revalidate,
        },
      }),
    ]);

    return apiResponse.single({
      data: res,
      message: "GET user area successful",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
