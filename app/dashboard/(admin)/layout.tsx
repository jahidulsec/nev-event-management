import { getAuthUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthUser();

  if (!authUser) redirect("/login");

  return <>{children}</>;
}
