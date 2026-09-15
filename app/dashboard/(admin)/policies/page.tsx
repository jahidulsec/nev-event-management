import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import { SearchForm } from "@/components/shared/inputs/search";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import { SectionHeading } from "@/components/shared/typography/heading";
import CreatePolicyButton from "@/features/policy/components/create-button";
import PolicyTable from "@/features/policy/components/table";
import { getPolicies } from "@/features/policy/libs/policy";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import React from "react";

export default function PoliciesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionHeading>Policies</SectionHeading>
        <SearchForm />
        <CreatePolicyButton />
      </SectionHeader>

      <SectionContent>
        <React.Suspense fallback={<TableSkeleton />}>
          <TableContainer searchParams={searchParams} />
        </React.Suspense>
      </SectionContent>
    </Section>
  );
}

const TableContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, size, search } = await searchParams;
  const res = await getPolicies({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.success ? undefined : res.message}>
      <PolicyTable data={res.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
