import { Badge, BadgeProps } from "@/components/ui/badge";
import { approver_type, user_role } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import React from "react";

const ApproverTypeBadge = ({
  variant = "outline",
  className,
  type,
  ...props
}: BadgeProps & { type: approver_type }) => {
  return (
    <Badge
      variant={variant}
      className={cn(
        type === "final"
          ? "text-lime-800 bg-lime-50"
          : type === "budget"
            ? "text-green-800 bg-green-50"
            : type === "third"
              ? "text-orange-800 bg-orange-50"
              : type === "second"
                ? "text-yellow-800 bg-yellow-50"
                : "text-rose-800 bg-rose-50",
        className,
      )}
      {...props}
    />
  );
};

const UserRoleBadge = ({
  variant = "outline",
  className,
  type,
  ...props
}: BadgeProps & { type: user_role }) => {
  return (
    <Badge
      variant={variant}
      {...props}
      className={cn(
        type === "director"
          ? "text-lime-800 bg-lime-50"
          : type === "marketing"
            ? "text-green-800 bg-green-50"
            : type === "slm"
              ? "text-orange-800 bg-orange-50"
              : type === "flm"
                ? "text-yellow-800 bg-yellow-50"
                : "text-rose-800 bg-rose-50",
        className,
      )}
    />
  );
};

const StatusBadge = ({
  variant = "outline",
  className,
  type,
  ...props
}: BadgeProps & { type: string }) => {
  return (
    <Badge
      variant={variant}
      className={cn(
        type === "approved"
          ? "bg-green-50 text-green-800"
          : type == "rejected"
            ? "text-destructive bg-destructive/10"
            : "text-yellow-800 bg-yellow-100",
        className,
      )}
      {...props}
    />
  );
};

export { ApproverTypeBadge, UserRoleBadge, StatusBadge };
