import { getEvent } from "@/features/events/libs/events";
import { getEventApprovers } from "@/features/event-approvers/libs/event-approvers";
import { hasPermission } from "@/lib/permission-guard";
import { Params } from "@/types/search-params";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PrintContainer from "@/features/events/components/print/print-container";

export const metadata: Metadata = {
  title: `Print - Event`,
};

export default async function EventFormPrintPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  if (!(await hasPermission("event:print"))) return notFound();

  const [res, approvers] = await Promise.all([
    getEvent(id?.toString() ?? ""),
    getEventApprovers(id?.toString() ?? ""),
  ]);

  if (!res.data) return notFound();

  return (
    <div>
      <PrintContainer eventData={res.data} eventApprover={approvers.data ?? []} />
    </div>
  );
}
