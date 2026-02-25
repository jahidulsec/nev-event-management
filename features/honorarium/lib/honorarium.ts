"use server";

import { db } from "@/config/db";
import {
  honorarium_calculation,
  honorarium_designation,
  Prisma,
} from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response";
import { getSerializeData } from "@/utils/helper";

export type HonorariumCalculationMultiProps =
  Prisma.honorarium_calculationGetPayload<{
    include: {
      honorarium_designation: {
        select: {
          designation: true;
        };
      };
    };
  }>;

export const getHonorariumCalculations = async () => {
  try {
    const res = await db.honorarium_calculation.findMany({
      include: {
        honorarium_designation: {
          select: {
            designation: true,
          },
        },
      },
    });

    const count = await db.honorarium_calculation.count();

    return apiResponse.multi<HonorariumCalculationMultiProps>({
      message: "Get honorarium list successful",
      data: getSerializeData(res) as HonorariumCalculationMultiProps[],
      count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};

export const getHonorariumDesignations = async () => {
  try {
    const res = await db.honorarium_designation.findMany();

    const count = await db.honorarium_designation.count();

    return apiResponse.multi<honorarium_designation>({
      message: "Get honorarium designation list successful",
      data: res,
      count,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error: error });
  }
};
