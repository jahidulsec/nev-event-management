"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setDashboardRole } from "@/features/auth/actions/login";
import { AuthUser } from "@/types/auth-user";
import React from "react";

export default function RoleSelect({ user, role }: { user: AuthUser, role: string }) {

    const handleRole = async(value: string) => {
        const res = await setDashboardRole(value)
    }

  return (
    <Select defaultValue={role ?? user.role[0]} onValueChange={handleRole}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {user.role.map((item) => (
            <SelectItem key={item} value={item}>
              {item.replaceAll("_",' ')}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
