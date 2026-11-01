import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, FilePlus2, LucideIcon, RotateCcw, XCircle } from "lucide-react";
import { UserRoleBadge } from "@/components/shared/badge/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatter";
import { ActivityKind, ActivityRow } from "@/services/dashboard";
import { getRoleLabel } from "./helpers";

const KIND_META: Record<
  ActivityKind,
  { icon: LucideIcon; verb: string; tone: string }
> = {
  submitted: {
    icon: FilePlus2,
    verb: "submitted",
    tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  approved: {
    icon: CheckCircle2,
    verb: "approved",
    tone: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  rejected: {
    icon: XCircle,
    verb: "rejected",
    tone: "bg-destructive/10 text-destructive",
  },
  rework: {
    icon: RotateCcw,
    verb: "sent back for rework",
    tone: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  },
};

export function ActivityFeed({ items }: { items: ActivityRow[] }) {
  if (!items.length)
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    );

  return (
    <ol className="flex flex-col">
      {items.map((item) => {
        const { icon: Icon, verb, tone } = KIND_META[item.kind];
        const at = new Date(item.at);

        return (
          <li
            key={item.id}
            className="flex items-start gap-3 border-b py-3 last:border-b-0 last:pb-0 first:pt-0"
          >
            <span
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                tone,
              )}
            >
              <Icon className="size-4" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">{item.actor ?? "Someone"}</span>{" "}
                <span className="text-muted-foreground">{verb}</span>{" "}
                <Link
                  href={`/dashboard/events/${item.eventId}/preview`}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {item.eventTitle}
                </Link>
              </p>

              {item.remarks && (
                <p className="mt-0.5 line-clamp-1 text-xs italic text-muted-foreground">
                  “{item.remarks}”
                </p>
              )}

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                {item.actorRole && (
                  <UserRoleBadge type={item.actorRole} className="px-1.5 py-0">
                    {getRoleLabel(item.actorRole)}
                  </UserRoleBadge>
                )}
                <time dateTime={item.at} title={formatDateTime(at)}>
                  {formatDistanceToNow(at, { addSuffix: true })}
                </time>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
