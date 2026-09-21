import { CheckCircle2, Clock, LucideIcon, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/formatter";
import { EventStatus, StatusCounts } from "@/services/dashboard";
import { MonthBucket } from "../../libs/dashboard";

/**
 * Dashboard charts. Plain HTML/SVG rendered on the server: no chart library,
 * no client JS. Colors come from the `--viz-*` tokens in globals.css.
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

/** Largest "nice" axis maximum (1/2/5 x 10^n) that fits `max` in `steps` ticks. */
const getNiceScale = (max: number, steps: number) => {
  if (max <= 0) return { step: 1, max: steps };

  const rough = max / steps;
  const power = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / power;
  const base = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = Math.max(1, base * power);

  return { step, max: step * steps };
};

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
  const visible = STATUS_ORDER.filter((status) => counts[status] > 0);

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
    <div
      role="img"
      aria-label={summary}
      className={cn("flex h-3 gap-0.5", className)}
    >
      {visible.map((status, index) => (
        <div
          key={status}
          title={`${STATUS_META[status].label}: ${counts[status]}`}
          // grow by count; the 2px gaps come out of the shared width
          style={{ flexGrow: counts[status], flexBasis: 0 }}
          className={cn(
            "h-full min-w-1.5",
            STATUS_META[status].swatch,
            index === 0 && "rounded-l-full",
            index === visible.length - 1 && "rounded-r-full",
          )}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Change over time: stacked columns                                           */
/* -------------------------------------------------------------------------- */

const PLOT_HEIGHT = "h-48";
const TICK_STEPS = 4;

export function MonthlyColumnChart({ months }: { months: MonthBucket[] }) {
  const peak = Math.max(...months.map((month) => month.total), 0);

  if (!peak)
    return (
      <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No events submitted in this period.
      </p>
    );

  const scale = getNiceScale(peak, TICK_STEPS);
  const ticks = Array.from({ length: TICK_STEPS + 1 }, (_, i) => i * scale.step);

  return (
    <div className="flex gap-3">
      {/* y axis */}
      <div aria-hidden className={cn("relative w-8 shrink-0", PLOT_HEIGHT)}>
        {ticks.map((tick, index) => (
          <span
            key={tick}
            style={{ bottom: `${(index / TICK_STEPS) * 100}%` }}
            className="absolute right-0 translate-y-1/2 text-xs tabular-nums text-muted-foreground"
          >
            {formatNumber(tick)}
          </span>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        {/* gridlines: hairline, solid, recessive */}
        <div
          aria-hidden
          className={cn("pointer-events-none absolute inset-x-0 top-0", PLOT_HEIGHT)}
        >
          {ticks.map((tick, index) => (
            <div
              key={tick}
              style={{ bottom: `${(index / TICK_STEPS) * 100}%` }}
              className="absolute inset-x-0 border-t border-border"
            />
          ))}
        </div>

        <ul className="relative flex">
          {months.map((month, index) => {
            const filled = STATUS_ORDER.filter((status) => month[status] > 0);
            const heightPct = (month.total / scale.max) * 100;
            const edge =
              index === 0
                ? "left-0"
                : index === months.length - 1
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2";

            return (
              <li key={month.key} className="flex min-w-0 flex-1 flex-col items-center">
                {/* the whole column slot is the hover/focus target, not just the thin bar */}
                <div
                  tabIndex={0}
                  aria-label={`${month.label}: ${month.total} events`}
                  className={cn(
                    "group/col relative flex w-full items-end justify-center rounded-md outline-none focus-visible:bg-accent/60 hover:bg-accent/40",
                    PLOT_HEIGHT,
                  )}
                >
                  <div
                    className="flex w-full max-w-6 flex-col-reverse gap-0.5"
                    style={{ height: `${heightPct}%` }}
                  >
                    {filled.map((status, i) => (
                      <div
                        key={status}
                        style={{ flexGrow: month[status], flexBasis: 0 }}
                        className={cn(
                          "min-h-0.75",
                          STATUS_META[status].swatch,
                          // 4px rounded data-end, square at the baseline
                          i === filled.length - 1 && "rounded-t-[4px]",
                        )}
                      />
                    ))}
                  </div>

                  <div
                    role="tooltip"
                    // sit just above the stack, but never rise out of the plot onto the legend (tooltip is ~8rem tall)
                    style={{ bottom: `min(calc(${heightPct}% + 8px), calc(100% - 8rem))` }}
                    className={cn(
                      "pointer-events-none absolute z-20 hidden w-44 rounded-lg border bg-popover p-3 text-xs text-popover-foreground shadow-md group-hover/col:block group-focus-visible/col:block",
                      edge,
                    )}
                  >
                    <p className="mb-2 flex items-baseline justify-between font-medium">
                      <span>{month.label}</span>
                      <span className="tabular-nums">{month.total} total</span>
                    </p>
                    <ul className="flex flex-col gap-1">
                      {STATUS_ORDER.map((status) => (
                        <li key={status} className="flex items-center gap-2">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              STATUS_META[status].swatch,
                            )}
                          />
                          <span className="text-muted-foreground">
                            {STATUS_META[status].label}
                          </span>
                          <span className="ml-auto tabular-nums">{month[status]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <span className="mt-2 text-xs text-muted-foreground">{month.label}</span>
              </li>
            );
          })}
        </ul>

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
      </div>
    </div>
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

  const max = Math.max(...rows.map((row) => row.total), 1);

  return (
    <>
      <ol aria-hidden className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate" title={row.label}>
                {row.label}
              </span>
              <span className="font-medium tabular-nums">{formatNumber(row.total)}</span>
            </div>
            {/* one series -> one hue; the track is a lighter step of the same hue */}
            <div className="mt-1.5 h-2 rounded-full bg-viz-series/15">
              <div
                className="h-full rounded-full bg-viz-series"
                style={{ width: `${(row.total / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ol>

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
