"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { range: "5-8m", count: 12 },
  { range: "8-11m", count: 28 },
  { range: "11-14m", count: 35 },
  { range: "14-17m", count: 18 },
  { range: "17-20m", count: 7 },
];

export function TreeHeightChart() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-1">Tree Height Distribution</h3>
        <p className="text-xs text-muted-foreground">
          Number of trees by height range
        </p>
      </div>
      <ChartContainer
        config={{
          count: {
            label: "Trees",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-[280px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="range"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
