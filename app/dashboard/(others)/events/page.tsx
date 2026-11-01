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
import { EventQueryType } from "@/features/events/schemas/events";
import { getAuthUser, getDashboardArea, getDashboardRole } from "@/lib/dal";
import { SearchParams } from "@/types/search-params";
import { Suspense } from "react";
import { getTitleCase } from "@/utils/formatter";
import { Metadata } from "next";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";

export const metadata: Metadata = {
  title: `Events`,
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Events";

  const permissions = await getActivePermissions();

  if (!permissions.includes("event:view")) return <NoAccess />;

  return (
    <Section>
      <SectionHeader>
        <SectionHeading>{pageTitle}</SectionHeading>

        <SectionActions>
          {permissions.includes("event:print") && <ExportButton />}
          {permissions.includes("event:create") && <CreateEventButton />}
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
  const permissions = await getActivePermissions();
  const dashboardRole = await getDashboardRole();
  const dashboardAreaCode = await getDashboardArea();

  const res = await getEvents({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString().trim(),
    role: dashboardRole as EventQueryType["role"],
    sap_area_code: dashboardAreaCode ?? undefined,
    employee_id: authUser?.employeeId,
    start: start?.toString(),
    end: end?.toString(),
    status: ["ec", "superadmin"].includes(dashboardRole ?? "")
      ? (status?.toString() as "approved")
      : "processing",
    is_archived: is_archived
      ? is_archived.toString() === "yes"
        ? "yes"
        : "no"
      : "no",
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTable
        data={res?.data ?? []}
        permissions={{
          update: permissions.includes("event:update"),
          print: permissions.includes("event:print"),
          delete: permissions.includes("event:delete"),
        }}
      />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
