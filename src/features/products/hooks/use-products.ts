"use client";

import { useQuery } from "@tanstack/react-query";

import { productKeys } from "@/features/products/constants/query-keys";
import { apiRequest } from "@/lib/api-client";
import { ProductsSchema } from "@/schemas/product.schema";
import type { ProductQuery } from "@/schemas/query.schema";

const PRODUCTS_STALE_TIME_MS = 60 * 1000; // 1 minute

export function useProducts(filters: ProductQuery = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) =>
      apiRequest({
        path: "/products",
        schema: ProductsSchema,
        searchParams: filters,
        signal,
      }),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
}
