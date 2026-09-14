import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import { SectionHeading } from "@/components/shared/typography/heading";
import CreateUserButton from "@/features/users/components/create-button";
import UserTable from "@/features/users/components/user-table";
import { getUsers } from "@/features/users/libs/users";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import React from "react";

export default function UserPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionHeading>Users</SectionHeading>
        <CreateUserButton />
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
  const res = await getUsers({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.message ? undefined : res.message}>
      <UserTable data={res.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
