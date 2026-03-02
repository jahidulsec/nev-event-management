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
import NotificationList from "@/features/notifications/components/shared/notification-list";
import { getNotifications } from "@/features/notifications/lib/notification";
import { getAuthUser } from "@/lib/dal";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE_SIZE } from "@/utils/settings";
import { Bell } from "lucide-react";
import { Suspense } from "react";

export default function NotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Notifications";

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
    work_area_code: user?.workAreaCode,
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <NotificationList data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
