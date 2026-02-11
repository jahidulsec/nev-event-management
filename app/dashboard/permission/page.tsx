import { getAuthUser } from "@/lib/dal";
import { notFound, redirect } from "next/navigation";

export default async function EventPermissionsPage() {
  const authUser = await getAuthUser();
  if (authUser?.role !== "superadmin") return notFound();

  return redirect("/dashboard/permission/event-type");
}
