"use client";

import { useMemo, useState } from "react";

import type { SortingState } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import {
  filterProductsByQuery,
  storeProductColumns,
} from "@/features/stores/components/store-products-columns";
import type { ProductSales } from "@/types/api";

const INITIAL_SORTING: SortingState = [{ id: "totalRevenue", desc: true }];

export interface StoreProductsTableProps {
  products: ProductSales[];
}

export function StoreProductsTable({ products }: StoreProductsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterProductsByQuery(products, search),
    [products, search],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          className="sm:max-w-xs"
          value={search}
          onValueChange={setSearch}
          placeholder="Search by name or SKU…"
          label="Search products"
        />
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {filtered.length} of {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <DataTable
        columns={storeProductColumns}
        data={filtered}
        initialSorting={INITIAL_SORTING}
        caption="Products sold by this store"
        emptyState={
          <EmptyState
            title="No products found"
            description="No products match your search."
            action={
              <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                Clear search
              </Button>
            }
          />
        }
      />
    </div>
  );
}
