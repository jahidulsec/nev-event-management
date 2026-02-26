import PrintSection from "@/features/event/components/print-section";
import { getEvent } from "@/features/event/lib/event";
import { getAuthUser, getDashboardRole } from "@/lib/dal";
import { Params } from "@/types/search-params";
import { notFound } from "next/navigation";
import React from "react";

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
      <PrintSection eventData={res.data} />
    </div>
  );
}
