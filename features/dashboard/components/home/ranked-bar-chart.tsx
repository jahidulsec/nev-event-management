"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatNumber } from "@/utils/formatter";

const ROW_HEIGHT = 40;

type Row = { label: string; total: number };

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-4)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function RankedBarChart({ rows }: { rows: Row[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full"
      style={{ height: rows.length * ROW_HEIGHT }}
    >
      <BarChart
        accessibilityLayer
        data={rows}
        layout="vertical"
        margin={{
          right: 48,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          hide
        />
        <XAxis dataKey="total" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={4}>
          <LabelList
            dataKey="label"
            position="insideLeft"
            offset={8}
            className="fill-(--color-label)"
            fontSize={12}
          />
          <LabelList
            dataKey="total"
            position="right"
            offset={8}
            className="fill-foreground tabular-nums"
            fontSize={12}
            formatter={(value) => formatNumber(Number(value))}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
