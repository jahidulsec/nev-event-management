import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import CreatEventTypeApproverButton from "@/features/event/components/type-approver/create-button";
import EventTypeApproverTable from "@/features/event/components/type-approver/table";
import { getEventTypeApprovers } from "@/features/event/lib/type-approver";
import { Params, SearchParams } from "@/types/search-params";
import React, { Suspense } from "react";

export default function EventTypeDetailsPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: Params;
}) {
  return (
    <>
      <Section>
        <SectionHeader>
          <SectionHeadingWithBackButton
            title="Approver List"
            subtitle="Permission / Event Type"
          />

          <CreatEventTypeApproverButton />
        </SectionHeader>

        <SectionContent>
          <Suspense>
            <ApproversContainer searchParams={searchParams} params={params} />
          </Suspense>
        </SectionContent>
      </Section>
    </>
  );
}

const ApproversContainer = async ({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: Params;
}) => {
  const { page, size, search } = await searchParams;
  const { typeId } = await params;
  const res = await getEventTypeApprovers({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
    type_id: typeId?.toString(),
    sort: 'asc'
  });
  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTypeApproverTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
