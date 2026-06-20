"use client";

import { useQuery } from "@tanstack/react-query";

import { storeKeys } from "@/features/stores/constants/query-keys";
import { apiRequest } from "@/lib/api-client";
import { StoreDetailSchema } from "@/schemas/api.schema";

const STORE_DETAIL_STALE_TIME_MS = 30 * 1000; // 30 seconds

export function useStore(id: string) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: ({ signal }) =>
      apiRequest({
        path: `/stores/${id}`,
        schema: StoreDetailSchema,
        signal,
      }),
    enabled: id.length > 0,
    staleTime: STORE_DETAIL_STALE_TIME_MS,
  });
}
