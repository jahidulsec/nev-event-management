import ProfileSection from "@/components/dashboard/profile-section";
import { getAuthUser } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";

export default async function DashboardHomePage() {
  const authUser = await getAuthUser();

  return (
    <>
      <ProfileSection user={authUser as AuthUser} />
    </>
  );
}
