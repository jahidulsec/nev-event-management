import { getAuthUser, getDashboardRole } from "@/lib/dal";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthUser();
  const role = await getDashboardRole();

  if (!authUser) redirect("/login");

  if (!role || role !== "superadmin") redirect("/dashboard/events");
  return <>{children}</>;
}
