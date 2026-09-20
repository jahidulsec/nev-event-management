import { getEvent } from "@/features/events/libs/events";
import { getDashboardRole } from "@/lib/dal";
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
  const role = await getDashboardRole();

  if (role === "ao") return notFound();

  const res = await getEvent(id?.toString() ?? "");

  if (!res.data) return notFound();

  return (
    <div>
      <PrintContainer eventData={res.data} />
    </div>
  );
}
