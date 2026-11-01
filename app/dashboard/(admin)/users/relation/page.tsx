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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { upsertUserAreas } from "@/features/users-area/actions/user-area";
import CreateUserAreaButton from "@/features/users-area/components/create-button";
import UserAreaTable from "@/features/users-area/components/table";
import { getUserAreas } from "@/features/users-area/libs/user-area";
import { upsertUserProducts } from "@/features/users-product/actions/user-product";
import CreateUserProductButton from "@/features/users-product/components/create-button";
import UserProductTable from "@/features/users-product/components/table";
import { getUserProducts } from "@/features/users-product/libs/user-product";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { RowPermissions } from "@/types/permission";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import React from "react";

export default async function UserRelationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const permissions = await getActivePermissions();

  const canViewArea = permissions.includes("user_area:view");
  const canViewProduct = permissions.includes("user_product:view");

  if (!canViewArea && !canViewProduct) return <NoAccess />;

  return (
    <Section>
      <SectionHeader>
        <SectionHeading>User Relations</SectionHeading>
      </SectionHeader>

      <SectionContent>
        <Tabs defaultValue={canViewArea ? "area" : "product"}>
          <TabsList>
            {canViewArea && <TabsTrigger value="area">Area Scope</TabsTrigger>}
            {canViewProduct && (
              <TabsTrigger value="product">Product Scope</TabsTrigger>
            )}
          </TabsList>

          {canViewArea && (
            <TabsContent value="area">
              <SectionContent className="mt-4">
                <SectionHeader>
                  <SearchForm />

                  <SectionActions>
                    {permissions.includes("user_area:import") && (
                      <>
                        <ExcelUploadButton action={upsertUserAreas as any} />
                        <DownloadButton filePath="/public/templates/user_area_template.xlsx" />
                      </>
                    )}
                    {permissions.includes("user_area:create") && (
                      <CreateUserAreaButton />
                    )}
                  </SectionActions>
                </SectionHeader>

                <React.Suspense fallback={<TableSkeleton />}>
                  <AreaScopeContainer
                    searchParams={searchParams}
                    permissions={{
                      update: permissions.includes("user_area:update"),
                      delete: permissions.includes("user_area:delete"),
                    }}
                  />
                </React.Suspense>
              </SectionContent>
            </TabsContent>
          )}

          {canViewProduct && (
            <TabsContent value="product">
              <SectionContent className="mt-4">
                <SectionHeader>
                  <SearchForm />
                  <SectionActions>
                    {permissions.includes("user_product:import") && (
                      <>
                        <ExcelUploadButton action={upsertUserProducts as any} />
                        <DownloadButton filePath="/public/templates/user_product_template.xlsx" />
                      </>
                    )}
                    {permissions.includes("user_product:create") && (
                      <CreateUserProductButton />
                    )}
                  </SectionActions>
                </SectionHeader>

                <React.Suspense fallback={<TableSkeleton />}>
                  <ProductScopeContainer
                    searchParams={searchParams}
                    permissions={{
                      update: permissions.includes("user_product:update"),
                      delete: permissions.includes("user_product:delete"),
                    }}
                  />
                </React.Suspense>
              </SectionContent>
            </TabsContent>
          )}
        </Tabs>
      </SectionContent>
    </Section>
  );
}

const AreaScopeContainer = async ({
  searchParams,
  permissions,
}: {
  searchParams: SearchParams;
  permissions: RowPermissions;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getUserAreas({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.success ? undefined : res.message}>
      <UserAreaTable data={res.data ?? []} permissions={permissions} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};

const ProductScopeContainer = async ({
  searchParams,
  permissions,
}: {
  searchParams: SearchParams;
  permissions: RowPermissions;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getUserProducts({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.success ? undefined : res.message}>
      <UserProductTable data={res.data ?? []} permissions={permissions} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
