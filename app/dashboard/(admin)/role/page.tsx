import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import { SectionHeading } from "@/components/shared/typography/heading";
import CreateRoleButton from "@/features/role/components/create-button";
import RoleTable from "@/features/role/components/role-table";
import { getRoles } from "@/features/role/libs/role";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import React from "react";

export default function RolePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionHeading>Roles</SectionHeading>
        <CreateRoleButton />
      </SectionHeader>

      <SectionContent>
        <React.Suspense fallback={<TableSkeleton />}>
          <TableContainer searchParams={searchParams} />{" "}
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
  const res = await getRoles({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.message ? undefined : res.message}>
      <RoleTable data={res.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
