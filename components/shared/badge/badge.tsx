import { Badge, BadgeProps } from "@/components/ui/badge";
import { approver_type } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const colorBadgeVariants = cva("border-transparent", {
  variants: {
    color: {
      lime: "text-lime-800 bg-lime-50",
      green: "text-green-800 bg-green-50",
      orange: "text-orange-800 bg-orange-50",
      yellow: "text-yellow-800 bg-yellow-50",
      rose: "text-rose-800 bg-rose-50",
      violet: "text-violet-700 bg-violet-100/50",
      blue: "text-blue-700 bg-blue-100/50",
      destructive: "text-destructive bg-destructive/10",
    },
  },
  defaultVariants: {
    color: "rose",
  },
});

const statusColorList: NonNullable<
  VariantProps<typeof colorBadgeVariants>["color"]
>[] = ["lime", "green", "orange", "yellow", "rose", "violet", "blue"];

const getColorByIndex = (index: number) =>
  statusColorList[index % statusColorList.length];

type ColorBadgeProps = Omit<BadgeProps, "variant"> &
  VariantProps<typeof colorBadgeVariants> & {
    variant?: BadgeProps["variant"];
  };

const ColorBadge = ({
  variant = "outline",
  color,
  className,
  ...props
}: ColorBadgeProps) => {
  return (
    <Badge
      variant={variant}
      className={cn(colorBadgeVariants({ color }), className)}
      {...props}
    />
  );
};

const ApproverTypeBadge = ({
  className,
  type,
  ...props
}: Omit<ColorBadgeProps, "color"> & { type: approver_type }) => {
  if (!type) return null;

  return (
    <ColorBadge
      color={
        type === "final"
          ? "lime"
          : type === "budget"
            ? "green"
            : type === "third"
              ? "orange"
              : type === "second"
                ? "yellow"
                : "rose"
      }
      className={className}
      {...props}
    />
  );
};

const UserRoleBadge = ({
  className,
  type,
  ...props
}: Omit<ColorBadgeProps, "color"> & { type: string }) => {
  if (!type) return null;

  return (
    <ColorBadge
      color={
        type === "director_sales"
          ? "blue"
          : type === "marketing"
            ? "green"
            : type === "slm"
              ? "orange"
              : type === "flm"
                ? "yellow"
                : type === "franchise_head"
                  ? "violet"
                  : "rose"
      }
      className={className}
      {...props}
    />
  );
};

const StatusBadge = ({
  className,
  type,
  ...props
}: Omit<ColorBadgeProps, "color"> & { type: string }) => {
  return (
    <ColorBadge
      color={
        type === "approved" || type === "active"
          ? "green"
          : type === "rejected" || type === "inactive"
            ? "destructive"
            : "yellow"
      }
      className={className}
      {...props}
    />
  );
};

export {
  ColorBadge,
  colorBadgeVariants,
  statusColorList,
  getColorByIndex,
  ApproverTypeBadge,
  UserRoleBadge,
  StatusBadge,
};
