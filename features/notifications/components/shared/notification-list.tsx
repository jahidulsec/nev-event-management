"use client";

import React from "react";
import { NotificationMultiProps } from "../../lib/notification";
import { NoData } from "@/components/shared/state/state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatter";
import { updateNotification } from "../../actions/notification";

export default function NotificationList({
  data,
}: {
  data: NotificationMultiProps[];
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-col gap-3">
      {data.length === 0 ? (
        <NoData />
      ) : (
        data.map((item) => (
          <article
            className={cn(
              "border rounded-md p-3",
              item.is_marked === "no" ? "bg-muted/35" : "",
            )}
            key={item.id}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="">
                <p>
                  <strong>{item.event.title}</strong>: {item.message}
                </p>
                {item.created_at && (
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {item.is_marked === "no" && (
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        await updateNotification(item.id, {
                          is_marked: "yes",
                        });
                      });
                    }}
                  >
                    Mark as read
                  </Button>
                )}
                {item.status === "action" && (
                  <Button
                    className="text-primary"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
