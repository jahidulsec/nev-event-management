import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionLoader } from "@/components/shared/skeleton/section";
import { SectionHeading } from "@/components/shared/typography/heading";
import CreateAreaButton from "@/features/area/components/create-button";
import PreviewTree from "@/features/area/components/preview-tree";
import { getAreas } from "@/features/area/libs/area";
import { SearchParams } from "@/types/search-params";
import React from "react";

export default function AreaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Section>
      <div className="border rounded-md p-4">
        <SectionHeader>
          <SectionHeading>Area</SectionHeading>

          <CreateAreaButton />
        </SectionHeader>

        <SectionContent>
          <React.Suspense fallback={<SectionLoader />}>
            <AreaPreview searchParams={searchParams} />
          </React.Suspense>
        </SectionContent>
      </div>
    </Section>
  );
}

const AreaPreview = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, search } = await searchParams;
  const res = await getAreas({
    page: Number(page || 1),
    size: 1000,
    search: search?.toString(),
  });
  return (
    <ErrorBoundary message={res.message ? undefined : res.message}>
      <PreviewTree data={res.data ?? []} />
    </ErrorBoundary>
  );
};
