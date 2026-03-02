import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/types/auth-user";
import Link from "next/link";
import { ProfileButton } from "../button/profile-button";
import RoleSelect from "./role-select";

export default function NavUser({
  user,
  role,
}: {
  user: AuthUser;
  role: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={"outline"}
        size={"icon"}
        className="rounded-full"
        asChild
      >
        <Link href={`/dashboard/notifications`}>
          <Bell /> <span className="sr-only">Notifications</span>
        </Link>
      </Button>
      <ProfileButton user={user} />
      <div className="hidden md:flex">
        <RoleSelect role={role} user={user} />
      </div>
    </div>
  );
}
