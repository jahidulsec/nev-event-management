import React, { Suspense } from "react";
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
import EventStatusUpdateForm from "@/features/event/components/status-form";
import { Separator } from "@/components/ui/separator";
import { getEventStatusHistories } from "@/features/event/lib/status-history";
import { SquareCheck, SquareX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatter";
import { event_current_status } from "@/lib/generated/prisma";
import { SectionSpinner } from "@/components/shared/spinner/section";
import { Step, StepContainer } from "@/components/shared/progress/step";

export default async function EventDetailsPage({ params }: { params: Params }) {
  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / edit"
        />
      </SectionHeader>
      <Suspense fallback={<SectionSpinner />}>
        <EventFormSection params={params} />
      </Suspense>
      <Suspense fallback={<SectionSpinner />}>
        <EventStatusHistorySection params={params} />
      </Suspense>
    </Section>
  );
}

const EventFormSection = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const res = await getEvent(id?.toString() ?? "");
  const eventTypeRes = await getEventTypes({ page: 1, size: 100 });
  const user = await getAuthUser();

  if (!res.data) return notFound();

  return (
    <SectionContent className="border p-6 rounded-md">
      <EventForm
        authUser={user as AuthUser}
        eventTypes={eventTypeRes.data ?? []}
        prevData={res.data}
      />

      {!["ao", "eo"].includes(user?.role as string) && (
        <div className="max-w-2xl mx-auto flex flex-col w-full py-10 gap-6">
          <Separator />
          <h4 className="w-full text-2xl font-medium">Approval Section</h4>
          <EventStatusUpdateForm authUser={user as AuthUser} event={res.data} />
        </div>
      )}
    </SectionContent>
  );
};

const EventStatusHistorySection = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const res = await getEventStatusHistories({
    page: 1,
    size: 100,
    event_id: id?.toString(),
  });

  if (res.data?.length === 0) return null;

  return (
    <div className="border rounded-md p-4 mt-6 py-10">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
        <h4 className="w-full text-2xl font-medium">Event Approval History</h4>
        <Separator />
        <StepContainer>
          {res.data?.map((item, index) => (
            <Step
              key={item.id}
              status={item.status}
              description={`${item.event_approver.user_role} (${item.event_approver.user_id}) - ${item.remarks}`}
              createdAt={item.created_at as Date}
              isLast={res.count === index + 1}
            />
          ))}
        </StepContainer>
      </div>
    </div>
  );
};
