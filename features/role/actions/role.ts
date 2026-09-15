"use server";

import { apiResponse } from "@/lib/response";
import { CreateRoleDTOType, UpdateRoleDTOType } from "../schema/schema";
import { roleService } from "@/services/role";


export const createRole = async (data: CreateRoleDTOType) => {
  try {
    const res = await roleService.createRole({ data });

    return apiResponse.single({
      data: res,
      message: "Role created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateRole = async (id: string, data: UpdateRoleDTOType) => {
  try {
    const res = await roleService.updateRole({
      filter: { role: id },
      data,
    });

    return apiResponse.single({
      data: res,
      message: "Role updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteRole = async (id: string) => {
  try {
    const res = await roleService.deleteRole({ filter: { role: id } });

    return apiResponse.single({
      data: res,
      message: "Role deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
