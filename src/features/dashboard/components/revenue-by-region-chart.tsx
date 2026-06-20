"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency, formatNumber } from "@/utils/format";

export interface RevenueByRegionDatum {
  region: string;
  totalRevenue: number;
}

export interface RevenueByRegionChartProps {
  data: RevenueByRegionDatum[];
}

interface RegionTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: number }>;
}

function RegionTooltip({ active, label, payload }: RegionTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-popover text-popover-foreground rounded-md border px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground tabular-nums">
        {formatCurrency(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
}

export function RevenueByRegionChart({ data }: RevenueByRegionChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No revenue data to display.
      </p>
    );
  }

  const summary = data
    .map((datum) => `${datum.region}: ${formatCurrency(datum.totalRevenue)}`)
    .join(", ");

  return (
    <figure role="img" aria-label={`Revenue by region. ${summary}`}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="region"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              width={80}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => formatNumber(Number(value))}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              content={<RegionTooltip />}
            />
            <Bar
              dataKey="totalRevenue"
              fill="var(--primary)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">Revenue by region: {summary}.</figcaption>
    </figure>
  );
}
