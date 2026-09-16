"use client";

import type { ReactElement } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LucideIcon, Settings, UserLock } from "lucide-react";
import { AuthUser } from "@/types/auth-user";
import { toast } from "sonner";
import { userLogout } from "@/features/auth/actions/login";
import React from "react";
import { FormSheet } from "@/components/shared/sheet/sheet";
import ResetPasswordForm from "@/features/dashboard/components/reset-password-form";
import UserProfileForm from "@/features/dashboard/components/profile-form";
import { UserRoleBadge } from "@/components/shared/badge/badge";
import { Button } from "@/components/ui/button";
import RoleSelect from "@/features/dashboard/components/role-select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AreaSelect from "../area-select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

type Props = {
  trigger: ReactElement;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
  user?: AuthUser;
  role?: string;
  area?: string;
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

const LOGOUT_ITEM: MenuItem = {
  label: "Signout",
  icon: LogOut,
  destructive: true,
};

const itemClass = "px-4 py-2.5 text-base cursor-pointer gap-3";

const areaScopeRole = ["flm", "slm", "franchise_head"];

const allowArea = (role: string) => areaScopeRole.some((i) => i === role);

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
  user,
  role,
  area,
}: Props) => {
  const [openResetPassword, setResetPassword] = React.useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);
  const [openRole, setOpenRole] = React.useState(false);

  return (
    <>
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>

        <DropdownMenuContent className="w-80" align={align}>
          <DropdownMenuGroup>
            {/* User Info */}
            <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
              <div className="relative">
                <Avatar className="size-10">
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
              </div>

              <div className="flex flex-col">
                <span className="text-foreground text-lg font-semibold">
                  {user?.name}
                </span>
                <div className="flex justify-center items-center">
                  <UserRoleBadge type={role as ""}>{role}</UserRoleBadge>
                  {allowArea(role ?? "") && area && (
                    <Badge variant={"outline"}>{area}</Badge>
                  )}
                  <Button
                    size={"xs"}
                    variant={"outline"}
                    className="border-dashed"
                    onClick={() => setOpenRole(true)}
                  >
                    Switch
                  </Button>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Settings */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={itemClass}
                onClick={() => setOpenProfile(true)}
              >
                <Settings size={20} className="text-foreground" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={itemClass}
                onClick={() => setResetPassword(true)}
              >
                <UserLock size={20} className="text-foreground" />
                <span>Reset Password</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              variant="destructive"
              className={itemClass}
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
              <LOGOUT_ITEM.icon size={20} />
              <span>{LOGOUT_ITEM.label}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormSheet
        open={openResetPassword}
        onOpenChange={setResetPassword}
        formTitle="Reset Password"
      >
        <ResetPasswordForm
          onClose={() => setResetPassword(false)}
          id={user?.employeeId ?? ""}
        />
      </FormSheet>

      {/* profile form */}
      <FormSheet
        open={openProfile}
        onOpenChange={setOpenProfile}
        formTitle="Profile"
      >
        <UserProfileForm
          employeeId={user?.employeeId ?? ""}
          onClose={() => setOpenProfile(false)}
        />
      </FormSheet>

      <Dialog open={openRole} onOpenChange={setOpenRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch your role</DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <RoleSelect user={user as AuthUser} role={role as string} />
          </Field>
          {allowArea(role ?? "") && (
            <Field>
              <FieldLabel>Area</FieldLabel>
              <AreaSelect
                user={user as AuthUser}
                sapAreaCode={area as string}
              />
            </Field>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDropdown;
