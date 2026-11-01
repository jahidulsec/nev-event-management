"use server";
import { decrypt } from "@/lib/session";
import { AuthUser, AuthUserRole } from "@/types/auth-user";
import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";

export const getAuthUser = async () => {
  try {
    // get cookie
    const cookie = await cookies();

    // get session
    const session = cookie.get("session")?.value;

    // get user data
    const user = await decrypt(session);

    return user as AuthUser;
  } catch (error) {
    // let Next.js handle its own prerender/dynamic errors
    unstable_rethrow(error);
    console.error(error);
    return null;
  }
};

export const getDashboardRole = async () => {
  try {
    // get cookie
    const cookie = await cookies();

    // get session
    const session = cookie.get("role")?.value;

    // get user data
    const role = await decrypt(session);

    return role?.role as string;
  } catch (error) {
    // let Next.js handle its own prerender/dynamic errors
    unstable_rethrow(error);
    console.error(error);
    return null;
  }
};



export const getDashboardArea = async () => {
  try {
    // get cookie
    const cookie = await cookies();

    // get session
    const session = cookie.get("area")?.value;

    // get user data
    const area = await decrypt(session);

    return area?.sapAreaCode as string;
  } catch (error) {
    // let Next.js handle its own prerender/dynamic errors
    unstable_rethrow(error);
    console.error(error);
    return null;
  }
};
