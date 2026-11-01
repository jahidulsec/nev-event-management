"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BellRing, Info } from "lucide-react";
import type { NotificationMultiProps } from "@/features/notifications/libs/notifications";

type Props = {
  trigger: ReactNode;
  notifications: NotificationMultiProps[];
  /** notifications that still need the user to act */
  actionCount?: number;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

const NotificationDropdown = ({
  trigger,
  notifications,
  actionCount = 0,
  defaultOpen,
  align = "end",
}: Props) => {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="p-0 w-sm rounded-2xl data-open:slide-in-from-top-20! data-closed:slide-out-to-top-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          <DropdownMenuGroup>
            {/* title */}
            <DropdownMenuLabel className="flex items-center justify-between p-4">
              <p className="text-base font-medium text-popover-foreground">
                Notifications
              </p>
              {actionCount > 0 && (
                <Badge className="h-5 font-normal leading-0">
                  {actionCount} {actionCount === 1 ? "Action" : "Actions"}
                </Badge>
              )}
            </DropdownMenuLabel>

            {/* Notifications */}
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No notifications yet
              </p>
            )}

            {notifications.map((item) => {
              const isAction = item.status === "action";
              const Icon = isAction ? BellRing : Info;

              return (
                <DropdownMenuItem
                  key={item.id}
                  asChild
                  className="mx-1.5 my-1 p-2 cursor-pointer"
                >
                  <Link
                    href={`/dashboard/events/${item.event_id}/preview`}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={cn(
                          "shrink-0 p-2.5 rounded-xl",
                          isAction ? "bg-orange-400/10" : "bg-blue-500/10",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-5",
                            isAction ? "text-orange-500" : "text-blue-500",
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-52 truncate text-sm font-medium text-popover-foreground">
                          {item.message}
                        </p>
                        <p className="max-w-52 truncate text-sm text-muted-foreground">
                          {item.events?.title}
                        </p>
                      </div>
                    </div>
                    {item.created_at && (
                      <p className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(item.created_at, {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </Link>
                </DropdownMenuItem>
              );
            })}

            {/* button */}
            <div className="mx-1.5 my-1 p-2">
              <DropdownMenuItem
                asChild
                className="justify-center rounded-xl bg-primary py-2 font-medium text-primary-foreground cursor-pointer focus:bg-primary/80 focus:text-primary-foreground"
              >
                <Link href="/dashboard/notifications">
                  See All Notifications
                </Link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationDropdown;
