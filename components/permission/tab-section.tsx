"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TabSection({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname();

  const buttonList = [
    {
      name: "Event Type",
      url: "/dashboard/permission/event-type",
    },
    {
      name: "Approver",
      url: "/dashboard/permission/approver",
    },
  ];

  return (
    <div
      className={cn(
        "flex items-center justify-between flex-wrap gap-5 my-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {buttonList.map((item, index) => (
          <Button
            key={index}
            variant={"ghost"}
            asChild
            className={cn(
              "border-b rounded-none border-transparent",
              pathname === item.url
                ? "border-secondary"
                : "text-muted-foreground",
            )}
          >
            <Link href={item.url}>{item.name}</Link>
          </Button>
        ))}
      </div>

      {children}
    </div>
  );
}
