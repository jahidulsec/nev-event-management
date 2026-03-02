import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/types/auth-user";
import Link from "next/link";
import { ProfileButton } from "../button/profile-button";
import RoleSelect from "./role-select";
import { getNotificationStats } from "@/features/notifications/lib/notification";
import { Badge } from "@/components/ui/badge";

export default async function NavUser({
  user,
  role,
}: {
  user: AuthUser;
  role: string;
}) {
  const res = await getNotificationStats({ work_area_code: user.workAreaCode });

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={"outline"}
        size={"icon"}
        className="rounded-full"
        asChild
      >
        <Link href={`/dashboard/notifications`} className="relative">
          <Bell /> <span className="sr-only">Notifications</span>{" "}
          <Badge variant={'secondary'} className="absolute -top-2 left-4">{(res.data?.total ?? 0) - (res.data?.marked ?? 0)}</Badge>
        </Link>
      </Button>
      <ProfileButton user={user} />
      <div className="hidden md:flex">
        <RoleSelect role={role} user={user} />
      </div>
    </div>
  );
}
