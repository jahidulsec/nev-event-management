"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setDashboardArea,
  setDashboardRole,
} from "@/features/auth/actions/login";
import { AuthUser } from "@/types/auth-user";
import { toast } from "sonner";

export default function AreaSelect({
  user,
  sapAreaCode,
}: {
  user: AuthUser;
  sapAreaCode?: string;
}) {
  const handleRole = async (value: string) => {
    const res = await setDashboardArea(value);
    toast[res.success ? "success" : "info"](res.message);
  };

  if (!user.sapAreaCodes || user.sapAreaCodes?.length === 0) return null;

  return (
    <Select
      defaultValue={sapAreaCode ?? user.sapAreaCodes[0]}
      onValueChange={handleRole}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {user.sapAreaCodes.map((item) => (
            <SelectItem key={item} value={item}>
              {item.replaceAll("_", " ")}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
