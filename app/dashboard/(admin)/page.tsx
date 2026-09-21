import { Section } from "@/components/shared/section/section";
import { AdminDashboard } from "@/features/dashboard/components/home/admin-dashboard";
import { DashboardSkeleton } from "@/features/dashboard/components/home/skeleton";
import { UserDashboard } from "@/features/dashboard/components/home/user-dashboard";
import { getAuthUser, getDashboardArea, getDashboardRole } from "@/lib/dal";
import { SUPERADMIN_ROLE } from "@/lib/permissions";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Dashboard`,
};

export default async function DashboardPage() {
  const [authUser, role, area] = await Promise.all([
    getAuthUser(),
    getDashboardRole(),
    getDashboardArea(),
  ]);

  // the layout redirects unauthenticated visitors to /login
  if (!authUser) return null;

  // superadmin gets the organisation-wide analytics view, everyone else a personal work queue
  const isSuperadmin = role === SUPERADMIN_ROLE;

  return (
    <Section className="flex flex-col gap-6 pb-10">
      <Suspense fallback={<DashboardSkeleton variant={isSuperadmin ? "admin" : "user"} />}>
        {isSuperadmin ? (
          <AdminDashboard user={authUser} />
        ) : (
          <UserDashboard user={authUser} role={role} sapAreaCode={area} />
        )}
      </Suspense>
    </Section>
  );
}
