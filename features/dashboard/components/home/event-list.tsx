import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronRight, PartyPopper } from "lucide-react";
import { StatusBadge } from "@/components/shared/badge/badge";
import { cn } from "@/lib/utils";
import { getTitleCase } from "@/utils/formatter";
import { EventBrief } from "@/services/dashboard";
import { STATUS_META } from "./charts";

const previewHref = (id: string) => `/dashboard/events/${id}/preview`;

/** "All caught up" style empty state used by the action lists. */
export function EmptyList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
      <PartyPopper className="size-6" />
      {children}
    </div>
  );
}

/** Events that need the viewer to do something (approve, rework). */
export function ActionList({
  items,
  count,
  waitingSince = false,
}: {
  items: EventBrief[];
  count: number;
  /** show how long each event has been waiting instead of its date */
  waitingSince?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={previewHref(item.id)}
            className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={item.title}>
                {item.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {[
                  getTitleCase(item.product),
                  item.submittedBy,
                  waitingSince && item.createdAt
                    ? `waiting ${formatDistanceToNow(new Date(item.createdAt))}`
                    : format(new Date(item.eventDate), "LLL dd, yyyy"),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}

      {count > items.length && (
        <li className="pt-1 text-center text-xs text-muted-foreground">
          + {count - items.length} more in{" "}
          <Link
            href="/dashboard/events"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Events
          </Link>
        </li>
      )}
    </ul>
  );
}

/** Next events by date, with a calendar chip. */
export function UpcomingList({ items }: { items: EventBrief[] }) {
  if (!items.length)
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No upcoming events.
      </p>
    );

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const date = new Date(item.eventDate);

        return (
          <li key={item.id}>
            <Link
              href={previewHref(item.id)}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/50"
            >
              <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <span className="text-[10px] font-semibold uppercase leading-none">
                  {format(date, "MMM")}
                </span>
                <span className="text-lg font-semibold leading-tight">
                  {format(date, "dd")}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" title={item.title}>
                  {item.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {format(date, "h:mm aaa")} · {item.venue}
                </p>
              </div>

              <StatusBadge
                type={item.status}
                className={cn("hidden sm:inline-flex")}
              >
                {STATUS_META[item.status].label}
              </StatusBadge>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
