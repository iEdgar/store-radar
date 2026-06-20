"use client";

import { useQuery } from "@tanstack/react-query";

import { overviewKeys } from "@/features/dashboard/constants/query-keys";
import { apiRequest } from "@/lib/api-client";
import { OverviewSchema } from "@/schemas/api.schema";

const OVERVIEW_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes (global KPIs)

export function useOverview() {
  return useQuery({
    queryKey: overviewKeys.all,
    queryFn: ({ signal }) =>
      apiRequest({
        path: "/overview",
        schema: OverviewSchema,
        signal,
      }),
    staleTime: OVERVIEW_STALE_TIME_MS,
  });
}
