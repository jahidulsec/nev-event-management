import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import { SearchForm } from "@/components/shared/inputs/search";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import {
  SectionHeading,
  SectionHeadingIcon,
} from "@/components/shared/typography/heading";
import { NoAccess, NoData } from "@/components/shared/state/state";
import { getAuthUser } from "@/lib/dal";
import { hasPermission } from "@/lib/permission-guard";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE_SIZE } from "@/utils/settings";
import { Bell } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import NotificationCard from "@/features/notifications/components/notification-card";
import { getNotifications } from "@/features/notifications/libs/notifications";

export const metadata: Metadata = {
  title: `Notifications`,
};

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Notifications";

  if (!(await hasPermission("notification:view"))) return <NoAccess />;

  return (
    <Section>
      <SectionHeader>
        <SectionHeading>
          <SectionHeadingIcon>
            <Bell />
          </SectionHeadingIcon>
          {pageTitle}
        </SectionHeading>

        <SectionActions>
          <SearchForm />
        </SectionActions>
      </SectionHeader>

      <SectionContent>
        <Suspense fallback={<TableSkeleton />}>
          <TableSection searchParams={searchParams} />
        </Suspense>
      </SectionContent>
    </Section>
  );
}

const TableSection = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, size, search } = await searchParams;
  const user = await getAuthUser();

  const res = await getNotifications({
    page: Number(page || 1),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString().trim(),
    employee_id: user?.employeeId,
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      {res.data?.length ? (
        <div className="flex flex-col gap-3">
          {res.data.map((item) => (
            <NotificationCard key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <NoData />
      )}
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
