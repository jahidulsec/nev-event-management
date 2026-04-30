import { getEvent } from "@/features/event/lib/event";
import { getEventApprovers } from "@/features/event/lib/event-approver";
import { getDashboardRole } from "@/lib/dal";
import { Params } from "@/types/search-params";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PrintContainer from "@/features/event/components/print/print-container";

export const metadata: Metadata = {
  title: `Print - Event`,
};

export default async function EventFormPrintPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const role = await getDashboardRole();

  if (role === "ao") return notFound();

  const res = await getEvent(id?.toString() ?? "");
  const eventApproverData = await getEventApprovers(id?.toString() ?? "");

  if (!res.data) return notFound();

  return (
    <div>
      <PrintContainer
        eventApprover={eventApproverData.data as any[]}
        eventData={res.data}
      />
    </div>
  );
}
