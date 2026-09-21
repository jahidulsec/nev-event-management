import { NoAccess } from "@/components/shared/state/state";
import { hasPermission } from "@/lib/permission-guard";
import { redirect } from "next/navigation";

export default async function EventPermissionsPage() {
  if (!(await hasPermission("event_type:view"))) return <NoAccess />;

  return redirect("/dashboard/permission/event-type");
}
