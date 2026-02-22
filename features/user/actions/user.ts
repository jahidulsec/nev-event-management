"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { createSession, deleteSession } from "@/lib/session";
import { AuthUserRole } from "@/types/auth-user";
import { hashPassword } from "@/utils/password";
import { revalidatePath } from "next/cache";
import { ProfileType, ResetPasswordType } from "./schema";

export const updateUserPassword = async (
  id: string,
  data: ResetPasswordType,
) => {
  try {
    const user = await db.user.update({
      where: { work_area_code: id },
      data: {
        password: await hashPassword(data.password),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/employee");

    return response({
      success: true,
      message: "Employee password is updated successfully",
      data: user,
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

export const updateUserProfile = async (id: string, data: ProfileType) => {
  try {
    const user = await db.user_details.update({
      where: { user_id: id },
      data: {
        ...(data.full_name && {
          full_name: data.full_name,
        }),
        ...(data.mobile && {
          mobile: data.mobile,
        }),
      },
      include: {
        user: {
          include: {
            user_role: {
              select: { role: true },
            },
          },
        },
      },
    });

    // update session
    await deleteSession();
    await createSession({
      workAreaCode: user.user_id,
      id: user.user.id,
      name: user?.full_name ?? user.user_id,
      mobile: user?.mobile ?? "",
      role: user.user.user_role.map((i) => i.role) as any[],
    });

    revalidatePath("/dashboard");
    revalidatePath("/");

    return response({
      success: true,
      message: "Your profile is updated successfully",
      data: user,
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
