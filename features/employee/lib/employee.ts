"use server";

import { db } from "@/config/db";
import { Prisma, user } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getCleanData } from "@/utils/formatter";
import { EmployeeQuerySchema, EmployeeQueryType } from "../actions/schema";

const getMulti = async (query: EmployeeQueryType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = EmployeeQuerySchema.parse(cleanData);

    // extract params
    const filter: Prisma.userWhereInput = {
      ...(params.search && {
        employee_id: {
          contains: params.search,
        },
      }),
      NOT: {
        role: "superadmin",
      },
    };

    const [data, count] = await Promise.all([
      db.user.findMany({
        where: filter,
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
      }),
      db.user.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<user>({
      message: "Get users successful",
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
    const data = await db.user.findUnique({
      where: { id },
    });

    // if quiz does not exist, throw error
    if (!data) throw new Error("Data not found");

    return apiResponse.single<user>({
      message: "Get user successful",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

export { getMulti as getEmployees, getSingle as getEmployee };
