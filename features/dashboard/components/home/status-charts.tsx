"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { EventStatus, StatusCounts } from "@/services/dashboard";
import { formatNumber } from "@/utils/formatter";
import { MonthBucket } from "../../libs/dashboard";

// mirrors STATUS_ORDER in ./charts; not imported to avoid a server/client cycle
const STATUSES: EventStatus[] = ["approved", "rework", "processing", "rejected"];

const chartConfig = {
  approved: {
    label: "Approved",
    color: "var(--viz-approved)",
  },
  rework: {
    label: "Rework",
    color: "var(--viz-rework)",
  },
  processing: {
    label: "In review",
    color: "var(--viz-processing)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--viz-rejected)",
  },
} satisfies ChartConfig;

export function MonthlyStatusChart({ months }: { months: MonthBucket[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
      <BarChart accessibilityLayer data={months}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={32}
          allowDecimals={false}
          tickFormatter={(value) => formatNumber(Number(value))}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(label, payload) =>
                `${label} · ${payload[0]?.payload.total ?? 0} total`
              }
            />
          }
        />
        {STATUSES.map((status, index) => (
          <Bar
            key={status}
            dataKey={status}
            stackId="a"
            fill={`var(--color-${status})`}
            maxBarSize={24}
            radius={index === STATUSES.length - 1 ? [4, 4, 0, 0] : 0}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export function StatusMixBar({ counts }: { counts: StatusCounts }) {
  const visible = STATUSES.filter((status) => counts[status] > 0);

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-3 w-full">
      <BarChart
        accessibilityLayer
        data={[counts]}
        layout="vertical"
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        barCategoryGap={0}
      >
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis type="category" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {visible.map((status, index) => (
          <Bar
            key={status}
            dataKey={status}
            stackId="a"
            fill={`var(--color-${status})`}
            // 2px gaps between segments, cut out of the card behind
            stroke="var(--card)"
            strokeWidth={2}
            minPointSize={6}
            radius={[
              index === 0 ? 6 : 0,
              index === visible.length - 1 ? 6 : 0,
              index === visible.length - 1 ? 6 : 0,
              index === 0 ? 6 : 0,
            ]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
