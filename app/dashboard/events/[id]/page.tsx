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
import { getEventTypes } from "@/features/event/lib/type";
import { getAuthUser } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";

export default async function EventDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  const res = await getEvent(id?.toString() ?? "");
  const eventTypeRes = await getEventTypes({ page: 1, size: 100 });
  const user = await getAuthUser();

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
        <EventForm authUser={user as AuthUser} eventTypes={eventTypeRes.data ?? []} prevData={res.data} />
      </SectionContent>
    </Section>
  );
}
