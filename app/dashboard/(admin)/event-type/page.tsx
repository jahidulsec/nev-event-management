import React, { Suspense } from "react";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import {
  SectionHeading,
  SectionHeadingIcon,
} from "@/components/shared/typography/heading";
import { getPageData } from "@/utils/helper";
import CreatEventTypeButton from "@/features/event-type/components/create-button";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import EventTypeTable from "@/features/event-type/components/table";
import PagePagination from "@/components/shared/pagination/pagination";
import { SearchParams } from "@/types/search-params";
import { Metadata } from "next";
import { getEventTypes } from "@/features/event-type/libs/event-type";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { EventTypeTablePermissions } from "@/features/event-type/components/table";

export const metadata: Metadata = {
  title: `Event Type - Permission`,
};

export default async function PermissionEventTypePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Event Type";

  const pageData = getPageData(pageTitle, "superadmin");

  const permissions = await getActivePermissions();

  if (!permissions.includes("event_type:view")) return <NoAccess />;

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionHeading>
            {pageData && (
              <SectionHeadingIcon>
                <pageData.icon />
              </SectionHeadingIcon>
            )}
            {pageTitle}
          </SectionHeading>
          {permissions.includes("event_type:create") && (
            <CreatEventTypeButton />
          )}
        </SectionHeader>

        <SectionContent>
          <Suspense fallback={<TableSkeleton />}>
            <TableSection
              searchParams={searchParams}
              permissions={{
                update: permissions.includes("event_type:update"),
                delete: permissions.includes("event_type:delete"),
                approvers: permissions.includes("approver:view"),
              }}
            />
          </Suspense>
        </SectionContent>
      </Section>
    </>
  );
}

const TableSection = async ({
  searchParams,
  permissions,
}: {
  searchParams: SearchParams;
  permissions: EventTypeTablePermissions;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getEventTypes({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTypeTable data={res?.data ?? []} permissions={permissions} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
