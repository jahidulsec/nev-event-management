"use server";

import { db } from "@/config/db";
import { doctor, Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { QuerySchema, QuerySchemaType } from "@/schemas/query";
import { getCleanData } from "@/utils/formatter";

const getMulti = async (query: QuerySchemaType) => {
  try {
    const cleanData = getCleanData(query);

    // validated searchparams
    const params = QuerySchema.parse(cleanData);

    // extract params
    const filter: Prisma.doctorWhereInput = {
      ...(params.search && {
        OR: [
          {
            full_name: {
              contains: params.search,
            },
          },
          {
            dr_master_id: {
              startsWith: params.search,
            },
          },
          {
            territory_code: {
              startsWith: params.search,
            },
          },
          {
            id: {
              startsWith: params.search,
            },
          },
        ],
      }),
    };

    const [data, count] = await Promise.all([
      db.doctor.findMany({
        where: filter,
        skip: (params.page - 1) * params.size,
        take: params.size,
        orderBy: {
          created_at: params.sort ?? "desc",
        },
      }),
      db.doctor.count({
        where: filter,
      }),
    ]);

    return apiResponse.multi<doctor>({
      message: "Get doctors successful",
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
    const data = await db.doctor.findUnique({
      where: { id },
    });

    // if quiz does not exist, throw error
    if (!data) throw new Error("Data not found");

    return apiResponse.single<doctor>({
      message: "Get doctor successful",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

export { getMulti as getDoctors, getSingle as getDoctor };
