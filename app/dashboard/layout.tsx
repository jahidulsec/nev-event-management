import { getAuthUser } from "@/types/dal";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const authUser = await getAuthUser();

  if (!authUser) redirect("/login");

  return <div>{children}</div>;
}
