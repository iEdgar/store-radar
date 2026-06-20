"use client";

import { useMemo, useState } from "react";

import type { SortingState } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ExportCsvButton } from "@/components/shared/export-csv-button";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import {
  filterProductsByQuery,
  productCsvColumns,
  storeProductColumns,
} from "@/features/stores/components/store-products-columns";
import type { ProductSales } from "@/types/api";

const INITIAL_SORTING: SortingState = [{ id: "totalRevenue", desc: true }];

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "store"
  );
}

export interface StoreProductsTableProps {
  products: ProductSales[];
  storeName: string;
}

export function StoreProductsTable({
  products,
  storeName,
}: StoreProductsTableProps) {
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
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {filtered.length} of {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
          <ExportCsvButton
            filename={`${slugify(storeName)}-products.csv`}
            columns={productCsvColumns}
            rows={filtered}
          />
        </div>
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
