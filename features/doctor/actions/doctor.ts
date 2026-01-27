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
    console.error(error);
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

    const quiz = await db.doctor.create({
      data: {
        full_name: validatedData[0].full_name,
        designation: validatedData[0].designation,
        speciality: validatedData[0].speciality,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/quiz");

    return response({
      success: true,
      message: "New quiz is created successfully",
      data: quiz,
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
