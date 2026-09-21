import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import CreatEventTypeApproverButton from "@/features/approver/components/create-button";
import EventTypeApproverTable from "@/features/approver/components/table";
import { getApprovers } from "@/features/approver/libs/approver";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { RowPermissions } from "@/types/permission";
import { Params, SearchParams } from "@/types/search-params";
import React, { Suspense } from "react";

export default async function EventTypeDetailsPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: Params;
}) {
  const permissions = await getActivePermissions();

  if (!permissions.includes("approver:view")) return <NoAccess />;

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionHeadingWithBackButton
            title="Approver List"
            subtitle="Permission / Event Type"
          />

          {permissions.includes("approver:create") && (
            <CreatEventTypeApproverButton />
          )}
        </SectionHeader>

        <SectionContent>
          <Suspense>
            <ApproversContainer
              searchParams={searchParams}
              params={params}
              permissions={{
                update: permissions.includes("approver:update"),
                delete: permissions.includes("approver:delete"),
              }}
            />
          </Suspense>
        </SectionContent>
      </Section>
    </>
  );
}

const ApproversContainer = async ({
  searchParams,
  params,
  permissions,
}: {
  searchParams: SearchParams;
  params: Params;
  permissions: RowPermissions;
}) => {
  const { page, size, search } = await searchParams;
  const { typeId } = await params;
  const res = await getApprovers({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
    type_id: typeId?.toString(),
    sort: 'asc'
  });
  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTypeApproverTable data={res?.data ?? []} permissions={permissions} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
