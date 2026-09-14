"use server";

import { apiResponse } from "@/lib/response";
import { CreateAreaDTOType, UpdateAreaDTOType } from "../schema/schema";
import { areaService } from "@/services/area";

export const createArea = async (data: CreateAreaDTOType) => {
  try {
    const res = await areaService.createArea({ data });

    return apiResponse.single({
      data: res,
      message: "Area created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateArea = async (id: string, data: UpdateAreaDTOType) => {
  try {
    const res = await areaService.updateArea({
      filter: { sap_area_code: id },
      data,
    });

    return apiResponse.single({
      data: res,
      message: "Area updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteArea = async (id: string) => {
  try {
    const res = await areaService.deleteArea({ filter: { sap_area_code: id } });

    return apiResponse.single({
      data: res,
      message: "Area deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
