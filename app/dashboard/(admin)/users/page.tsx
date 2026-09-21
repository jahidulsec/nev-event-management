import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import { DownloadButton } from "@/components/shared/button/download";
import { ExcelUploadButton } from "@/components/shared/button/excel-upload";
import { SearchForm } from "@/components/shared/inputs/search";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import { SectionHeading } from "@/components/shared/typography/heading";
import { upsertUsers } from "@/features/users/actions/users";
import CreateUserButton from "@/features/users/components/create-button";
import UserTable from "@/features/users/components/user-table";
import { getUsers } from "@/features/users/libs/users";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { RowPermissions } from "@/types/permission";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import React from "react";

export default async function UserPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const permissions = await getActivePermissions();

  if (!permissions.includes("user:view")) return <NoAccess />;

  return (
    <Section>
      <SectionHeader>
        <SectionHeading>Users</SectionHeading>

        <SectionActions>
          <SearchForm />
          {permissions.includes("user:import") && (
            <>
              <ExcelUploadButton action={upsertUsers as any} />
              <DownloadButton filePath="/public/templates/user_template.xlsx" />
            </>
          )}
          {permissions.includes("user:create") && <CreateUserButton />}
        </SectionActions>
      </SectionHeader>

      <SectionContent>
        <React.Suspense fallback={<TableSkeleton />}>
          <TableContainer
            searchParams={searchParams}
            permissions={{
              update: permissions.includes("user:update"),
              delete: permissions.includes("user:delete"),
            }}
          />{" "}
        </React.Suspense>
      </SectionContent>
    </Section>
  );
}

const TableContainer = async ({
  searchParams,
  permissions,
}: {
  searchParams: SearchParams;
  permissions: RowPermissions;
}) => {
  const { page, size, search } = await searchParams;
  const res = await getUsers({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.message ? undefined : res.message}>
      <UserTable data={res.data ?? []} permissions={permissions} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
