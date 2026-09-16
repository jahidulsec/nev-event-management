"use server";

import { response } from "@/lib/response";
import {
  createSession,
  deleteSession,
  saveArea,
  saveRole,
} from "@/lib/session";
import { isValidPassword } from "@/utils/password";
import { LoginType } from "./schema";
import { userService } from "@/services/user";

export const userLogin = async (data: LoginType) => {
  try {
    // check user
    const user = await userService.getUserUniq({
      filter: {
        employee_id: data.username,
      },
      options: {
        include: {
          users_role: {
            select: {
              role: true,
            },
          },
          users_area: {
            select: {
              sap_area_code: true,
            },
          },
        },
      },
      cacheOption: {
        revalidate: "off",
      },
    });

    if (!user) throw new Error("User does not exist");

    const userRoles = user.users_role.map((i) => i.role);
    const userAreaCodes = user.users_area.map((i) => i.sap_area_code);

    // check password
    if (!(await isValidPassword(data.password, user.password)))
      throw new Error("Invalid password");

    // create session
    await createSession({
      employeeId: user.employee_id,
      email: user.email,
      role: userRoles,
      name: user.full_name,
      sapAreaCodes: userAreaCodes,
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

export const setDashboardArea = async (sapAreaCode: string) => {
  try {
    await saveArea(sapAreaCode);
    return response({
      success: true,
      message: "Dashboard area is switch to " + sapAreaCode,
    });
  } catch (error) {
    return response({
      success: false,
      message: (error as Error).message ?? "Something went wrong",
    });
  }
};
