import ProfileSection from "@/components/dashboard/profile-section";
import { LogoFull } from "@/components/shared/logo/logo";
import { getAuthUser } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";
import React from "react";

export default async function DashboardHomePage() {
  const authUser = await getAuthUser();

  return (
    <>
      <ProfileSection user={authUser as AuthUser} />
    </>
  );
}
