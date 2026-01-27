"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import {
  EmployeesSchema,
  EmployeesType,
  EmployeeType,
  UpdateEmployeeType,
} from "./schema";
import { hashPassword } from "@/utils/password";

export const createEmployee = async (data: EmployeeType) => {
  try {
    const { password, ...rest } = data;

    const employee = await db.user.create({
      data: {
        password: await hashPassword(password),
        ...rest,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/employees");

    return response({
      success: true,
      message: "New employee is created successfully",
      data: employee,
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

export const updateEmployee = async (id: string, data: UpdateEmployeeType) => {
  try {
    const { password, ...rest } = data;

    const employee = await db.user.update({
      where: { id },
      data: {
        ...(password && { password: await hashPassword(password) }),
        ...rest,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/employees");

    return response({
      success: true,
      message: "Employee is updated successfully",
      data: employee,
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

export const deleteEmployee = async (id: string) => {
  try {
    const employee = await db.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/employees");

    return response({
      success: true,
      message: "Doctor is deleted successfully",
      data: employee,
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

export const createEmployees = async (data: EmployeesType) => {
  try {
    const validatedData = EmployeesSchema.parse(data);

    if (validatedData.length === 0) throw new Error("No column is included");

    const employees = await db.user.create({
      data: {
        employee_id: validatedData[0].employee_id,
        role: validatedData[0].role,
        password: validatedData[0].password,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/employees");

    return response({
      success: true,
      message: "New employees is created successfully",
      data: employees,
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
