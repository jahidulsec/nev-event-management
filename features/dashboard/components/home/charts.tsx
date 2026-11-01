import { CheckCircle2, Clock, LucideIcon, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/formatter";
import { EventStatus, StatusCounts } from "@/services/dashboard";
import { MonthBucket } from "../../libs/dashboard";
import { RankedBarChart } from "./ranked-bar-chart";
import { MonthlyStatusChart, StatusMixBar } from "./status-charts";

/**
 * Dashboard charts. Legends render on the server; the plots use Recharts on
 * the client via shadcn's ChartContainer. Colors come from the `--viz-*`
 * tokens in globals.css.
 *
 * Every chart has an `sr-only` table twin so values never depend on hover.
 */

export const STATUS_ORDER: EventStatus[] = [
  "approved",
  "rework",
  "processing",
  "rejected",
];

export const STATUS_META: Record<
  EventStatus,
  { label: string; icon: LucideIcon; swatch: string }
> = {
  approved: { label: "Approved", icon: CheckCircle2, swatch: "bg-viz-approved" },
  rework: { label: "Rework", icon: RotateCcw, swatch: "bg-viz-rework" },
  processing: { label: "In review", icon: Clock, swatch: "bg-viz-processing" },
  rejected: { label: "Rejected", icon: XCircle, swatch: "bg-viz-rejected" },
};

const sumCounts = (counts: StatusCounts) =>
  STATUS_ORDER.reduce((sum, status) => sum + counts[status], 0);

/* -------------------------------------------------------------------------- */
/* Legend                                                                      */
/* -------------------------------------------------------------------------- */

/** Identity-only legend (no numbers) for charts that plot several statuses. */
export function StatusKey({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {STATUS_ORDER.map((status) => {
        const { label, icon: Icon, swatch } = STATUS_META[status];

        return (
          <li key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("size-2.5 rounded-full", swatch)} />
            <Icon className="size-3.5" />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

export function StatusLegend({
  counts,
  className,
}: {
  counts: StatusCounts;
  className?: string;
}) {
  const total = sumCounts(counts);

  return (
    <ul className={cn("grid grid-cols-2 gap-x-6 gap-y-2.5", className)}>
      {STATUS_ORDER.map((status) => {
        const { label, icon: Icon, swatch } = STATUS_META[status];
        const count = counts[status];

        return (
          <li key={status} className="flex items-center gap-2 text-sm">
            <span className={cn("size-2.5 shrink-0 rounded-full", swatch)} />
            <Icon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-muted-foreground">{label}</span>
            <span className="ml-auto font-medium tabular-nums">
              {formatNumber(count)}
            </span>
            <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
              {total ? `${Math.round((count / total) * 100)}%` : "0%"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Part-to-whole: one stacked bar                                              */
/* -------------------------------------------------------------------------- */

export function StackedBar({
  counts,
  className,
  trackClassName = "bg-muted",
}: {
  counts: StatusCounts;
  className?: string;
  trackClassName?: string;
}) {
  const total = sumCounts(counts);

  const summary = STATUS_ORDER.map(
    (status) => `${STATUS_META[status].label} ${counts[status]}`,
  ).join(", ");

  if (!total)
    return (
      <div
        role="img"
        aria-label="No events yet"
        className={cn("h-3 rounded-full", trackClassName, className)}
      />
    );

  return (
    <div role="img" aria-label={summary} className={className}>
      <StatusMixBar counts={counts} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Change over time: stacked columns                                           */
/* -------------------------------------------------------------------------- */

export function MonthlyColumnChart({ months }: { months: MonthBucket[] }) {
  const peak = Math.max(...months.map((month) => month.total), 0);

  if (!peak)
    return (
      <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No events submitted in this period.
      </p>
    );

  return (
    <>
      <div aria-hidden>
        <MonthlyStatusChart months={months} />
      </div>

      <table className="sr-only">
        <thead>
          <tr>
            <th>Month</th>
            {STATUS_ORDER.map((status) => (
              <th key={status}>{STATUS_META[status].label}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {months.map((month) => (
            <tr key={month.key}>
              <td>{month.label}</td>
              {STATUS_ORDER.map((status) => (
                <td key={status}>{month[status]}</td>
              ))}
              <td>{month.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Compare magnitude: ranked bars, one hue                                     */
/* -------------------------------------------------------------------------- */

export function RankedBars({
  rows,
  caption,
  emptyLabel = "No data yet.",
}: {
  rows: { label: string; total: number }[];
  caption: string;
  emptyLabel?: string;
}) {
  if (!rows.length)
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>;

  return (
    <>
      <div aria-hidden>
        <RankedBarChart rows={rows} />
      </div>

      <table className="sr-only">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Trend: sparkline                                                            */
/* -------------------------------------------------------------------------- */

export function Sparkline({
  values,
  label,
}: {
  values: number[];
  label: string;
}) {
  const width = 96;
  const height = 32;
  const pad = 5;

  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const stepX = (width - pad * 2) / Math.max(values.length - 1, 1);

  const points = values.map((value, index) => ({
    x: pad + index * stepX,
    y: height - pad - ((value - min) / span) * (height - pad * 2),
  }));

  const last = points.at(-1);
  if (!last) return null;

  return (
    <svg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0 overflow-visible"
    >
      <polyline
        fill="none"
        stroke="var(--viz-series)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
      />
      {/* end dot with a 2px surface ring so it stays legible over the line */}
      <circle
        cx={last.x}
        cy={last.y}
        r={4}
        fill="var(--viz-series)"
        stroke="var(--card)"
        strokeWidth={2}
      />
    </svg>
  );
}
