"use server";

import { apiResponse } from "@/lib/response";
import { areaQuerySchema, AreaQueryType } from "../schema/schema";
import { areaService } from "@/services/area";
import { Prisma } from "@/lib/generated/prisma/client";

export const getAreas = async (query: AreaQueryType) => {
  try {
    const { page, size, search } = areaQuerySchema.parse(query);

    const filter: Prisma.areaWhereInput = {
      ...(search && {
        OR: [
          {
            sap_area_code: {
              startsWith: search,
            },
          },
          {
            area_name: {
              startsWith: search,
            },
          },
          {
            parent_area_code: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const [res, count] = await Promise.all([
      areaService.getAreas({
        filter,
        take: size,
        skip: (page - 1) * size,
        sort: {
          sap_area_code: "asc",
        },
      }),
      areaService.getAreaCount({ filter }),
    ]);

    return apiResponse.multi({ data: res ?? [], count });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const getArea = async (id: string) => {
  try {
    const [res] = await Promise.all([
      areaService.getAreaUniq({
        filter: {
          sap_area_code: id,
        },
      }),
    ]);

    return apiResponse.single({ data: res, message: "GET area successful" });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
