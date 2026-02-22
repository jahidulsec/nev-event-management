"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut, User, UserLock } from "lucide-react";
import { toast } from "sonner";
import { FormSheet } from "../sheet/sheet";
import { AuthUser } from "@/types/auth-user";
import { userLogout } from "@/features/auth/actions/login";
import ResetPasswordForm from "@/features/user/components/reset-password-form";
import UserProfileForm from "@/features/user/components/profile-form";

const ProfileButton = ({ user }: { user: AuthUser }) => {
  const [openProfile, setOpenProfile] = React.useState(false);
  const [openResetPassword, setResetPassword] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"} className="rounded-full">
            <User /> <span className="sr-only">Profile</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setResetPassword(true)}>
              <UserLock /> Reset Password
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                toast.promise(userLogout, {
                  loading: "Logging out...",
                  success: (data) => {
                    if (!data.success) throw data;
                    return data.message;
                  },
                  error: (data) => data.message,
                })
              }
            >
              <LogOut /> Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* profile form */}
      <FormSheet
        open={openProfile}
        onOpenChange={setOpenProfile}
        formTitle="Profile"
      >
        <UserProfileForm
          prevData={user}
          onClose={() => setOpenProfile(false)}
        />
      </FormSheet>

      {/* Reset password form */}
      <FormSheet
        open={openResetPassword}
        onOpenChange={setResetPassword}
        formTitle="Reset Password"
      >
        <ResetPasswordForm
          onClose={() => setResetPassword(false)}
          id={user.workAreaCode}
        />
      </FormSheet>
    </>
  );
};

export { ProfileButton };
