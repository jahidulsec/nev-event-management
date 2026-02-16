"use server";

import { db } from "@/config/db";
import { response } from "@/lib/response";
import { createSession, deleteSession } from "@/lib/session";
import { isValidPassword } from "@/utils/password";
import { LoginType } from "./schema";

export const userLogin = async (data: LoginType) => {
  let name = "";
  try {
    // check user
    const user = await db.user.findUnique({
      where: {
        work_area_code: data.work_area_code,
      },
    });

    if (!user) throw new Error("User does not exist");

    // check password
    if (!(await isValidPassword(data.password, user.password)))
      throw new Error("Invalid password");

    if (user.role === "ao") {
      const userDetails = await db.ao.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (user.role === "flm") {
      const userDetails = await db.flm.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (user.role === "slm") {
      const userDetails = await db.slm.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (user.role === "director") {
      const userDetails = await db.director.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (user.role === "marketing") {
      const userDetails = await db.marketing.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (user.role === "eo") {
      const userDetails = await db.eo.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else {
      const userDetails = await db.user_details.findUnique({
        where: {
          user_id: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    }

    // create session
    await createSession({
      id: user.id,
      workAreaCode: user.work_area_code,
      role: user.role,
      mobile: "",
      name: name,
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
