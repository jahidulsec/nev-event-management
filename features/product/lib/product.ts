"use server";

import { db } from "@/config/db";
import { Prisma, product, user } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getCleanData } from "@/utils/formatter";
import { ProductQuerySchema, ProductQueryType } from "../actions/schema";

const getMulti = async (query: ProductQueryType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = ProductQuerySchema.parse(cleanData);

    // extract params
    const filter: Prisma.productWhereInput = {
      ...(params.search && {
        name: {
          contains: params.search,
        },
      }),
    };

    const [data, count] = await Promise.all([
      db.product.findMany({
        where: filter,
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
      }),
      db.product.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<product>({
      message: "Get products successful",
      data: data,
      count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

const getSingle = async (id: string) => {
  try {
    const data = await db.product.findUnique({
      where: { id },
    });

    // if quiz does not exist, throw error
    if (!data) throw new Error("Data not found");

    return apiResponse.single<product>({
      message: "Get product successful",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

export { getMulti as getProducts, getSingle as getProduct };
