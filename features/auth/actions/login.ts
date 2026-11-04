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
import { redirect, RedirectType } from "next/navigation";

export const userLogin = async (data: LoginType) => {
  try {
    // check user; never cached so credential and role/area changes take
    // effect immediately on the next login attempt
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
        cache: false,
      },
    });

    if (!user) throw new Error("User does not exist");
    if (user.status === "inactive") throw new Error("You do not have permission");

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

    // set default area for dashboard
    if (userAreaCodes[0]) await saveArea(userAreaCodes[0]);
  } catch (error) {
    console.error(error);
    return response({
      success: false,
      message: (error as Error).message ?? "Something went wrong",
    });
  }

  // redirect from the action (outside try, since redirect throws) so the
  // dashboard renders with the new session cookie instead of a client-cached
  // logged-out redirect to /login
  redirect("/dashboard", RedirectType.replace);
};

export const userLogout = async () => {
  try {
    await deleteSession();
  } catch (error) {
    return response({
      success: false,
      message: (error as Error).message ?? "Something went wrong",
    });
  }

  // redirect from the action so the current dashboard page is never
  // re-rendered logged out; otherwise the client router caches the layout's
  // redirect to /login and replays it on the next login
  redirect("/login", RedirectType.replace);
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
