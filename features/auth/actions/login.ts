"use server";

import { db } from "@/config/db";
import { response } from "@/lib/response";
import { createSession, deleteSession } from "@/lib/session";
import { isValidPassword } from "@/utils/password";
import { LoginType } from "./schema";

export const userLogin = async (data: LoginType) => {
  try {
    // check user
    const user = await db.user.findUnique({
      where: {
        employee_id: data.employee_id,
      },
      include: {
        user_details: true,
      },
    });

    if (!user) throw new Error("User does not exist");

    // check password
    if (!(await isValidPassword(data.password, user.password)))
      throw new Error("Invalid password");

    const role = user.role;

    // create session
    await createSession({
      id: user.id,
      employeeId: user.employee_id,
      role: user.role,
      mobile: "",
      name: user.user_details?.full_name ?? user.employee_id,
    });

    return response({
      success: true,
      message: "You are logged in successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return response({
      success: false,
      message: (error as Error).message ?? "Something went wrong",
    });
  }
};

export const userLogout = async () => {
  try {
    await deleteSession();
    return response({ success: true, message: "You are logged out" });
  } catch (error) {
    return response({
      success: false,
      message: (error as Error).message ?? "Something went wrong",
    });
  }
};
