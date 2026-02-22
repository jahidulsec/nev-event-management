import { getAuthUser, getDashboardRole } from "@/lib/dal";
import { notFound, redirect } from "next/navigation";

export default async function EventPermissionsPage() {
  const role = await getDashboardRole();

  if (role !== "superadmin") return notFound();

  return redirect("/dashboard/permission/event-type");
}
