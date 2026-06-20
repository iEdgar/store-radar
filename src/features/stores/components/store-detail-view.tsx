"use client";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionTitle } from "@/components/shared/section-title";
import { API_ERROR_CODES } from "@/constants/api";
import { StoreDetailSkeleton } from "@/features/stores/components/store-detail-skeleton";
import { StoreNotFound } from "@/features/stores/components/store-not-found";
import { StoreProductsTable } from "@/features/stores/components/store-products-table";
import { StoreSummaryCards } from "@/features/stores/components/store-summary-cards";
import { TopProducts } from "@/features/stores/components/top-products";
import { useStore } from "@/features/stores/hooks/use-store";
import { ApiClientError } from "@/lib/api-client";

export interface StoreDetailViewProps {
  storeId: string;
}

export function StoreDetailView({ storeId }: StoreDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useStore(storeId);

  if (isLoading) {
    return <StoreDetailSkeleton />;
  }

  if (isError) {
    if (
      error instanceof ApiClientError &&
      error.code === API_ERROR_CODES.STORE_NOT_FOUND
    ) {
      return <StoreNotFound />;
    }

    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/" }]} />
        <ErrorState
          title="Couldn't load the store"
          description="We couldn't load this store's details. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { store, summary, topProducts, products } = data;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs
          items={[{ label: "Dashboard", href: "/" }, { label: store.name }]}
        />
        <PageHeader
          title={store.name}
          description={`${store.city} · ${store.region}`}
        />
      </div>

      <section aria-labelledby="summary-section" className="space-y-4">
        <SectionTitle id="summary-section" title="Sales summary" />
        <StoreSummaryCards summary={summary} />
      </section>

      <section aria-labelledby="top-products-section" className="space-y-4">
        <SectionTitle id="top-products-section" title="Top selling products" />
        <TopProducts products={topProducts} />
      </section>

      <section aria-labelledby="products-section" className="space-y-4">
        <SectionTitle id="products-section" title="Products" />
        <StoreProductsTable products={products} storeName={store.name} />
      </section>
    </div>
  );
}
