import Link from "next/link";
import { BellRing, Info, Star } from "lucide-react";
import { ColorBadge } from "@/components/shared/badge/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatter";
import { NotificationMultiProps } from "../libs/notifications";

export default function NotificationCard({
  data,
}: {
  data: NotificationMultiProps;
}) {
  const isAction = data.status === "action";
  const Icon = isAction ? BellRing : Info;

  const eventInfo = [
    data.events?.title,
    data.events?.product?.name,
    data.events?.type,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/dashboard/events/${data.event_id}/preview`}
      className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-accent/50"
    >
      <div
        className={cn(
          "shrink-0 rounded-xl p-2.5",
          isAction
            ? "bg-orange-400/10 text-orange-500"
            : "bg-blue-500/10 text-blue-500",
        )}
      >
        <Icon className="size-5" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{data.message}</p>

          <div className="flex shrink-0 items-center gap-2">
            {data.is_marked === "yes" && (
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
            )}
            <ColorBadge color={isAction ? "orange" : "blue"}>
              {isAction ? "Action required" : "Info"}
            </ColorBadge>
          </div>
        </div>

        {eventInfo && (
          <p className="truncate text-sm text-muted-foreground">{eventInfo}</p>
        )}

        {data.created_at && (
          <p className="text-xs text-muted-foreground">
            {formatDateTime(data.created_at)}
          </p>
        )}
      </div>
    </Link>
  );
}
