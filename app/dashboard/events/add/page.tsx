import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import EventForm from "@/features/event/components/form";
import { getEventTypes } from "@/features/event/lib/type";
import { getAuthUser } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";
import React from "react";

export default async function EventCreatePage() {
  const authUser = await getAuthUser();
  const res = await getEventTypes({ page: 1, size: 100 });

  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / create"
        />
      </SectionHeader>

      <SectionContent className="border p-6 rounded-md">
        <EventForm user={authUser as AuthUser} eventTypes={res.data ?? []} />
      </SectionContent>
    </Section>
  );
}
