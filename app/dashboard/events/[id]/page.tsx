import React from "react";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import EventForm from "@/features/event/components/form";
import { getEvent } from "@/features/event/lib/event";
import { Params } from "@/types/search-params";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  const res = await getEvent(id?.toString() ?? "");

  if (!res.data) return notFound();

  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / edit"
        />
      </SectionHeader>

      <SectionContent className="border p-6 rounded-md">
        <EventForm prevData={res.data} />
      </SectionContent>
    </Section>
  );
}
