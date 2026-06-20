"use client";

import { useQuery } from "@tanstack/react-query";

import { storeKeys } from "@/features/stores/constants/query-keys";
import { apiRequest } from "@/lib/api-client";
import { StoreSummaryListSchema } from "@/schemas/api.schema";
import type { StoreQuery } from "@/schemas/query.schema";

const STORES_STALE_TIME_MS = 30 * 1000; // 30 seconds

export function useStores(filters: StoreQuery = {}) {
  return useQuery({
    queryKey: storeKeys.list(filters),
    queryFn: ({ signal }) =>
      apiRequest({
        path: "/stores",
        schema: StoreSummaryListSchema,
        searchParams: filters,
        signal,
      }),
    staleTime: STORES_STALE_TIME_MS,
  });
}
