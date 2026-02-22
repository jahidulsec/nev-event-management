"use server";

import { db } from "@/config/db";
import { response } from "@/lib/response";
import { createSession, deleteSession, saveRole } from "@/lib/session";
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
      include: {
        user_role: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!user) throw new Error("User does not exist");

    const userRoles = user.user_role.map((i) => i.role);

    // check password
    if (!(await isValidPassword(data.password, user.password)))
      throw new Error("Invalid password");

    if (userRoles.includes("ao")) {
      const userDetails = await db.ao.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (userRoles.includes("flm")) {
      const userDetails = await db.flm.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (userRoles.includes("slm")) {
      const userDetails = await db.slm.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (userRoles.includes("franchise_head")) {
      const userDetails = await db.franchise_head.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (userRoles.includes("director")) {
      const userDetails = await db.franchise_head.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (userRoles.includes("marketing")) {
      const userDetails = await db.marketing.findUnique({
        where: {
          work_area_code: user.work_area_code,
        },
      });

      name = userDetails?.full_name ?? user.work_area_code;
    } else if (userRoles.includes("ec")) {
      const userDetails = await db.ec.findUnique({
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
      role: userRoles,
      mobile: "",
      name: name,
    });

    // set default role for dashboard
    await saveRole(userRoles[0]);

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

export const setDashboardRole = async (role: string) => {
  try {
    await saveRole(role);
    return response({
      success: true,
      message: "Dashboard role is switch to " + role,
    });
  } catch (error) {
    return response({
      success: false,
      message: (error as Error).message ?? "Something went wrong",
    });
  }
};
