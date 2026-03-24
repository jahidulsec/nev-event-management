"use client";

import React from "react";
import { NotificationMultiProps } from "../../lib/notification";
import { NoData } from "@/components/shared/state/state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatter";
import { updateNotification } from "../../actions/notification";
import { useRouter } from "@bprogress/next";

export default function NotificationList({
  data,
}: {
  data: NotificationMultiProps[];
}) {
  const [pending, startTransition] = React.useTransition();
  const [pending1, startTransition1] = React.useTransition();

  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      {data.length === 0 ? (
        <NoData />
      ) : (
        data.map((item) => (
          <article
            className={cn(
              "border rounded-md p-3 hover:border-secondary transition-colors duration-300",
              item.is_marked === "no" ? "bg-muted/50" : "",
            )}
            key={item.id}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="">
                <p>
                  {item.event.product.name}, {item.event.type}, {" "}
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
                    disabled={pending1}
                    onClick={() => {
                      startTransition1(async () => {
                        await updateNotification(item.id, {
                          is_marked: "yes",
                        });
                        router.push(
                          `/dashboard/events/${item.event_id}/preview`,
                        );
                      });
                    }}
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
