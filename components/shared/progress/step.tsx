"use client";

import { event_current_status } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime, getTitleCase } from "@/utils/formatter";
import { SquareCheck, SquareX } from "lucide-react";
import { StatusBadge } from "../badge/badge";

const Step = ({
  status,
  description,
  createdAt,
  isLast,
}: {
  description: React.ReactNode;
  createdAt: Date;
  isLast?: boolean;
  status: event_current_status;
}) => {
  return (
    <div className="flex gap-6 overflow-hidden min-h-20 py-3">
      <p className="text-sm hidden lg:block mt-1.5">{formatDateTime(createdAt)}</p>

      {/* icon */}
      <div className="relative">
        <div
          className={cn(
            "w-fit h-fit p-2 rounded-full after:bg-muted-foreground after:w-px after:h-full after:block after:absolute after:left-2 after:mx-2 after:-bottom-10",
            isLast ? "after:hidden" : "",
            status === "approved"
              ? "bg-green-100"
              : status === "rejected"
                ? "bg-red-100"
                : "bg-yellow-100",
          )}
        >
          {status === "approved" ? (
            <SquareCheck className="size-4 fill-green-500/40 text-green-700" />
          ) : status === "rejected" ? (
            <SquareX className="size-4 fill-red-500/40 text-red-700" />
          ) : (
            <SquareCheck className="size-4 fill-yellow-500/40 text-yellow-700" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 bg-muted/35 w-full px-3 py-1.5 rounded-md">
        <p></p>
        <div className="text-foreground">
          {" "}
          <StatusBadge type={status}>{getTitleCase(status.replaceAll("_", " "))}</StatusBadge>
          <p className="">
            {description}
          </p>
        </div>
        <p className="block lg:hidden py-3 lg:py-0 text-muted-foreground text-xs">{formatDateTime(createdAt)}</p>
      </div>
    </div>
  );
};

const StepContainer = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return <div {...props} className={cn("flex flex-col", className)} />;
};

export { Step, StepContainer };
