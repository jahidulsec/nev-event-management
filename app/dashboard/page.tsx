import ProfileSection from "@/components/dashboard/profile-section";
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeading2 } from "@/components/shared/typography/heading";
import { Button } from "@/components/ui/button";
import NotificationList from "@/features/notifications/components/shared/notification-list";
import { getNotifications } from "@/features/notifications/lib/notification";
import { getAuthUser } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";

export default async function DashboardHomePage() {
  const authUser = await getAuthUser();

  return (
    <>
      <ProfileSection user={authUser as AuthUser} />

      <Section>
        <div className="border p-6 rounded-md">
          <SectionHeader>
            <SectionHeading2 className="text-xl font-semibold text-primary w-fit">
              Recent Activities
            </SectionHeading2>
            <Button className="text-secondary" variant={"link"}>
              See all
            </Button>
          </SectionHeader>
          <SectionContent>
            <NotificationSection user={authUser as AuthUser} />
          </SectionContent>
        </div>
      </Section>
    </>
  );
}

const NotificationSection = async ({ user }: { user: AuthUser }) => {
  const res = await getNotifications({
    page: 1,
    size: 20,
    work_area_code: user.workAreaCode,
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <NotificationList data={res.data ?? []} />
    </ErrorBoundary>
  );
};
