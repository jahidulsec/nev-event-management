import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/types/auth-user";
import Link from "next/link";
import { ProfileButton } from "../button/profile-button";

export default function NavUser({ user }: { user: AuthUser }) {
  return (
    <div className="flex items-center gap-3">
      {user.role.includes("superadmin") && (
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
      )}
      <ProfileButton user={user} />
    </div>
  );
}
