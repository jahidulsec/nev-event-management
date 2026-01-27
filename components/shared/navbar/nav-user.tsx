import React from "react";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/types/auth-user";
import Link from "next/link";
import { ProfileButton } from "../button/profile-button";

export default function NavUser({ user }: { user: AuthUser }) {
  return (
    <div className="flex items-center gap-3">
      {user.role === "superadmin" && (
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full"
          asChild
        >
          <Link href={`/dashboard/settings`}>
            <Settings /> <span className="sr-only">Settings</span>
          </Link>
        </Button>
      )}
      <ProfileButton user={user} />
    </div>
  );
}
