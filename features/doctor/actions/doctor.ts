"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { DoctorsSchema, DoctorsType, DoctorType } from "./schema";

export const createDoctor = async (data: DoctorType) => {
  try {
    const doctor = await db.doctor.create({
      data: data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/doctors");

    return response({
      success: true,
      message: "New doctor is created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const updateDoctor = async (id: string, data: DoctorType) => {
  try {
    const doctor = await db.doctor.update({
      where: { id },
      data: data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/doctors");

    return response({
      success: true,
      message: "Doctor is updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(JSON.stringify(error));
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const deleteDoctor = async (id: string) => {
  try {
    const doctor = await db.doctor.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/doctors");

    return response({
      success: true,
      message: "Doctor is deleted successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const createDoctors = async (data: DoctorsType) => {
  try {
    const validatedData = DoctorsSchema.parse(data);

    if (validatedData.length === 0) throw new Error("No column is included");

    for (let i = 0; i < validatedData.length; i++) {
      await db.doctor.upsert({
        where: {
          dr_master_id: validatedData[i].DrMasterID,
        },
        create: {
          full_name: validatedData[i].DoctorName,
          degrees: validatedData[i].Degrees,
          speciality: validatedData[i].Speciality,
          dr_child_id: validatedData[i].DrChildID,
          dr_master_id: validatedData[i].DrMasterID,
          chamber: validatedData[i].Chamber,
          area_name: validatedData[i].AreaName,
          territory_code: validatedData[i].TerritoryCode,
        },
        update: {
          full_name: validatedData[i].DoctorName,
          degrees: validatedData[i].Degrees,
          speciality: validatedData[i].Speciality,
          dr_child_id: validatedData[i].DrChildID,
          dr_master_id: validatedData[i].DrMasterID,
          chamber: validatedData[i].Chamber,
          area_name: validatedData[i].AreaName,
          territory_code: validatedData[i].TerritoryCode,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/doctors");

    return response({
      success: true,
      message: "New doctors is created successfully",
      data: [],
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};
