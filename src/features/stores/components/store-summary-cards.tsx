import { DollarSign, Layers, Package, Receipt } from "lucide-react";

import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency, formatNumber } from "@/utils/format";
import type { StoreDetailSummary } from "@/types/api";

export interface StoreSummaryCardsProps {
  summary: StoreDetailSummary;
}

export function StoreSummaryCards({ summary }: StoreSummaryCardsProps) {
  const cards = [
    {
      title: "Total Sales",
      icon: DollarSign,
      value: formatCurrency(summary.totalSales),
      helperText: undefined as string | undefined,
    },
    {
      title: "Products Sold",
      icon: Package,
      value: formatNumber(summary.productsSold),
      helperText: undefined,
    },
    {
      title: "Categories",
      icon: Layers,
      value: formatNumber(summary.totalCategories),
      helperText: undefined,
    },
    {
      title: "Avg. Revenue / SKU",
      icon: Receipt,
      value: formatCurrency(summary.averageRevenuePerProduct),
      helperText: "Total sales ÷ product count",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          icon={card.icon}
          value={card.value}
          helperText={card.helperText}
        />
      ))}
    </div>
  );
}
