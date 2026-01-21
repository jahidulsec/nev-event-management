"use server";
import { decrypt } from "@/lib/session";
import { AuthUser } from "@/types/auth-user";
import { cookies } from "next/headers";

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
    console.error(error);
    return null;
  }
};
