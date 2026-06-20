"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency, formatPercent } from "@/utils/format";

export interface RevenueByCategoryDatum {
  category: string;
  totalRevenue: number;
}

export interface RevenueByCategoryChartProps {
  data: RevenueByCategoryDatum[];
}

interface EnrichedDatum extends RevenueByCategoryDatum {
  fraction: number;
}

const SLICE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const sliceColor = (index: number) => SLICE_COLORS[index % SLICE_COLORS.length];

interface CategoryTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: EnrichedDatum }>;
}

function CategoryTooltip({ active, payload }: CategoryTooltipProps) {
  const datum = payload?.[0]?.payload;
  if (!active || !datum) {
    return null;
  }

  return (
    <div className="bg-popover text-popover-foreground rounded-md border px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{datum.category}</p>
      <p className="text-muted-foreground tabular-nums">
        {formatCurrency(datum.totalRevenue)} · {formatPercent(datum.fraction)}
      </p>
    </div>
  );
}

export function RevenueByCategoryChart({ data }: RevenueByCategoryChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No revenue data to display.
      </p>
    );
  }

  const total = data.reduce((sum, datum) => sum + datum.totalRevenue, 0);
  const enriched: EnrichedDatum[] = data.map((datum) => ({
    ...datum,
    fraction: total > 0 ? datum.totalRevenue / total : 0,
  }));

  const summary = enriched
    .map(
      (datum) =>
        `${datum.category}: ${formatCurrency(datum.totalRevenue)} (${formatPercent(datum.fraction)})`,
    )
    .join(", ");

  return (
    <figure className="flex flex-col items-center gap-4 sm:flex-row">
      <div
        role="img"
        aria-label={`Revenue by category. ${summary}`}
        className="h-48 w-full shrink-0 sm:w-48"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enriched}
              dataKey="totalRevenue"
              nameKey="category"
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {enriched.map((datum, index) => (
                <Cell key={datum.category} fill={sliceColor(index)} />
              ))}
            </Pie>
            <Tooltip content={<CategoryTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full flex-1 space-y-1.5">
        {enriched.map((datum, index) => (
          <li key={datum.category} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: sliceColor(index) }}
              aria-hidden="true"
            />
            <span className="flex-1 truncate">{datum.category}</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(datum.totalRevenue)}
            </span>
            <span className="text-muted-foreground w-10 text-right tabular-nums">
              {formatPercent(datum.fraction)}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
