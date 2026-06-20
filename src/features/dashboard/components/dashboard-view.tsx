"use client";

import type { ReactNode } from "react";

import { RefreshCw, Store } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionTitle } from "@/components/shared/section-title";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { DashboardFilters } from "@/features/dashboard/components/dashboard-filters";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { StoreTable } from "@/features/stores/components/store-table";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format";

const STORE_TABLE_SKELETON_ROWS = 6;
const STORE_TABLE_COLUMNS = 5;

export function DashboardView() {
  const { filters, overview, stores } = useDashboard();

  const storeRows = stores.data ?? [];
  const totalStores = overview.data?.storeCount ?? storeRows.length;
  const isBackgroundFetching = stores.isFetching && !stores.isLoading;
  const showStatus = !stores.isLoading && !stores.isError;
  const countLabel = filters.hasActiveFilters
    ? `${formatNumber(storeRows.length)} of ${formatNumber(totalStores)} stores`
    : `${formatNumber(totalStores)} stores`;

  let storesContent: ReactNode;
  if (stores.isLoading) {
    storesContent = (
      <TableSkeleton
        rows={STORE_TABLE_SKELETON_ROWS}
        columns={STORE_TABLE_COLUMNS}
        label="Loading stores"
      />
    );
  } else if (stores.isError) {
    storesContent = (
      <ErrorState
        title="Couldn't load stores"
        description="We couldn't load the store list. Please try again."
        onRetry={() => stores.refetch()}
      />
    );
  } else if (storeRows.length === 0) {
    storesContent = (
      <EmptyState
        icon={Store}
        title="No stores found"
        description={
          filters.hasActiveFilters
            ? "No stores match your current filters."
            : "There are no stores to display yet."
        }
        action={
          filters.hasActiveFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={filters.onClearFilters}
            >
              Clear filters
            </Button>
          ) : undefined
        }
      />
    );
  } else {
    storesContent = (
      <div
        aria-busy={isBackgroundFetching}
        className={cn(
          "transition-opacity",
          isBackgroundFetching && "opacity-60",
        )}
      >
        <StoreTable stores={storeRows} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Sales performance across all stores."
      />

      <DashboardStats
        data={overview.data}
        isLoading={overview.isLoading}
        isError={overview.isError}
        onRetry={() => overview.refetch()}
      />

      <section aria-labelledby="stores-section" className="space-y-4">
        <SectionTitle id="stores-section" title="Stores" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <DashboardFilters
            search={filters.search}
            onSearchChange={filters.onSearchChange}
            region={filters.region}
            onRegionChange={filters.onRegionChange}
            regionOptions={filters.regionOptions}
          />
          {showStatus ? (
            <div
              className="text-muted-foreground flex items-center gap-2 text-sm"
              aria-live="polite"
            >
              {isBackgroundFetching ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  Updating…
                </span>
              ) : null}
              <span>{countLabel}</span>
            </div>
          ) : null}
        </div>
        {storesContent}
      </section>
    </div>
  );
}
