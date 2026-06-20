import { DollarSign, Package, Store, Tags } from "lucide-react";

import { ErrorState } from "@/components/shared/error-state";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/utils/format";
import type { Overview } from "@/types/api";

export interface DashboardStatsProps {
  data: Overview | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function DashboardStats({
  data,
  isLoading,
  isError,
  onRetry,
}: DashboardStatsProps) {
  if (isError) {
    return (
      <ErrorState
        title="Couldn't load metrics"
        description="We couldn't load the dashboard metrics. Please try again."
        onRetry={onRetry}
      />
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      icon: DollarSign,
      value: data ? formatCurrency(data.totalRevenue) : null,
    },
    {
      title: "Products Sold",
      icon: Package,
      value: data ? formatNumber(data.totalProductsSold) : null,
    },
    {
      title: "Stores",
      icon: Store,
      value: data ? formatNumber(data.storeCount) : null,
    },
    {
      title: "Categories",
      icon: Tags,
      value: data ? formatNumber(data.categoriesCount) : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          icon={card.icon}
          value={
            isLoading || !data ? <Skeleton className="h-7 w-24" /> : card.value
          }
        />
      ))}
    </div>
  );
}
