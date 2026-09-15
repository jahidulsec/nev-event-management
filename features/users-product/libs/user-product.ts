"use server";

import { apiResponse } from "@/lib/response";
import {
  userProductQuerySchema,
  UserProductQueryType,
} from "@/features/users-product/schema/schema";
import { userProductService } from "@/services/user-product";
import { Prisma } from "@/lib/generated/prisma/client";
import { ServerCacheOptions } from "@/lib/server-cache";

export type UserProductMultiProps = Prisma.user_productGetPayload<{
  include: { product: true; users: true };
}>;

export const getUserProducts = async (query: UserProductQueryType) => {
  try {
    const { page, size, search } = userProductQuerySchema.parse(query);

    const filter: Prisma.user_productWhereInput = {
      ...(search && {
        OR: [
          {
            employee_id: {
              startsWith: search,
            },
          },
          {
            product_id: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      userProductService.getUserProducts({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          created_at: "desc",
        },
        options: { include: { product: true, users: true } },
      }),
      userProductService.getUserProductCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getUserProduct = async (
  id: string,
  revalidate?: ServerCacheOptions["revalidate"],
) => {
  try {
    const [res] = await Promise.all([
      userProductService.getUserProductUniq({
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
      message: "GET user product successful",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
