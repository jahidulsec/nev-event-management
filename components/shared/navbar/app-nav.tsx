import NavUser from "./nav-user";
import NavMenu from "./nav-menu";
import NavTitle from "./nav-title";
import { getAuthUser, getDashboardRole } from "@/lib/dal";
import { AuthUser, AuthUserRole } from "@/types/auth-user";

export default async function AppNav() {
  const authUser = await getAuthUser();
  const dashboardRole = await getDashboardRole();

  const role = dashboardRole as string;

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between container mx-auto px-6 bg-background">
      {/* left */}
      <NavTitle role={role} />

      {/* center */}
      <NavMenu role={role} />

      {/* right */}
      <NavUser role={role} user={authUser as AuthUser} />
    </header>
  );
}
