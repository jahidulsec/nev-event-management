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
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import React from "react";

export default async function UserRelationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionHeading>User Relations</SectionHeading>
      </SectionHeader>

      <SectionContent>
        <Tabs defaultValue="area">
          <TabsList>
            <TabsTrigger value="area">Area Scope</TabsTrigger>
            <TabsTrigger value="product">Product Scope</TabsTrigger>
          </TabsList>

          <TabsContent value="area">
            <SectionContent className="mt-4">
              <SectionHeader>
                <SearchForm />

                <SectionActions>
                  <ExcelUploadButton action={upsertUserAreas as any} />
                  <DownloadButton filePath="/public/templates/user_area_template.xlsx" />
                  <CreateUserAreaButton />
                </SectionActions>
              </SectionHeader>

              <React.Suspense fallback={<TableSkeleton />}>
                <AreaScopeContainer searchParams={searchParams} />
              </React.Suspense>
            </SectionContent>
          </TabsContent>

          <TabsContent value="product">
            <SectionContent className="mt-4">
              <SectionHeader>
                <SearchForm />
                <SectionActions>
                  <ExcelUploadButton action={upsertUserProducts as any} />
                  <DownloadButton filePath="/public/templates/user_product_template.xlsx" />
                  <CreateUserProductButton />
                </SectionActions>
              </SectionHeader>

              <React.Suspense fallback={<TableSkeleton />}>
                <ProductScopeContainer searchParams={searchParams} />
              </React.Suspense>
            </SectionContent>
          </TabsContent>
        </Tabs>
      </SectionContent>
    </Section>
  );
}

const AreaScopeContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getUserAreas({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.success ? undefined : res.message}>
      <UserAreaTable data={res.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};

const ProductScopeContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getUserProducts({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.success ? undefined : res.message}>
      <UserProductTable data={res.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
