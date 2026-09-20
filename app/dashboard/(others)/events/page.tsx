import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import { DatePickerWithRange } from "@/components/shared/date-picker/date-range-picker";
import { SearchForm } from "@/components/shared/inputs/search";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { Select } from "@/components/shared/select/select";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import {
  SectionHeading,
  SectionHeadingIcon,
} from "@/components/shared/typography/heading";
import CreateEventButton from "@/features/events/components/create-button";
import ExportButton from "@/features/events/components/export-button";
import EventTable from "@/features/events/components/table";
import { getEvents } from "@/features/events/libs/events";
import { getAuthUser, getDashboardArea, getDashboardRole } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";
import { SearchParams } from "@/types/search-params";
import { getPageData } from "@/utils/helper";
import { Suspense } from "react";
import { getTitleCase } from "@/utils/formatter";
import { Metadata } from "next";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";

export const metadata: Metadata = {
  title: `Events`,
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Events";

  const user = await getAuthUser();

  return (
    <Section>
      <SectionHeader>
        <SectionHeading>{pageTitle}</SectionHeading>

        <SectionActions>
          {user?.role.includes("ao") && <CreateEventButton />}
          {/* {user?.role.some((i) => i === "ec" || i === "superadmin") && (
            <ExportButton />
          )} */}
        </SectionActions>
      </SectionHeader>

      <div className="flex items-center gap-1.5 my-6 flex-col sm:flex-row bg-muted/35 p-3 rounded-xl">
        <DatePickerWithRange className="w-full sm:w-fit" />
        <Select
          className="w-full sm:w-fit"
          placeholder="Filter by status"
          paramsName="status"
          data={["approved", "processing", "rejected"].map((item) => ({
            label: getTitleCase(item),
            value: item,
          }))}
        />
        <SearchForm className="sm:ml-auto bg-background" />
      </div>

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
  const { page, size, search, status, start, end, is_archived } =
    await searchParams;

  const authUser = await getAuthUser();
  const dashboardRole = await getDashboardRole();
  const dashboardAreaCode = await getDashboardArea();

  const res = await getEvents({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString().trim(),
    // work_area_code: dashboardAreaCode ?? undefined,
    // role: dashboardRole as any,
    // status: ["ec", "superadmin"].includes(dashboardRole ?? "")
    //   ? (status?.toString() as "approved")
    //   : "processing",
    // start: start?.toString(),
    // end: end?.toString(),
    // is_archived: is_archived
    //   ? is_archived.toString() === "yes"
    //     ? "yes"
    //     : "no"
    //   : "no",
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
