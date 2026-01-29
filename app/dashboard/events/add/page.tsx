import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import EventForm from "@/features/event/components/form";
import React from "react";

export default function EventCreatePage() {
  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / create"
        />
      </SectionHeader>

      <SectionContent className="border p-6 rounded-md">
        <EventForm />
      </SectionContent>
    </Section>
  );
}
