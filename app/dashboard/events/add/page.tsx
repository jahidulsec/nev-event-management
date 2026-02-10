import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import EventForm from "@/features/event/components/form";
import { getAuthUser } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";
import React from "react";

export default async function EventCreatePage() {

  const authUser = await getAuthUser()

  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / create"
        />
      </SectionHeader>

      <SectionContent className="border p-6 rounded-md">
        <EventForm user={authUser as AuthUser} />
      </SectionContent>
    </Section>
  );
}
