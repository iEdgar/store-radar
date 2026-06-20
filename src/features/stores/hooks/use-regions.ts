"use client";

import { useQuery } from "@tanstack/react-query";

import { storeKeys } from "@/features/stores/constants/query-keys";
import { apiRequest } from "@/lib/api-client";
import { RegionsSchema } from "@/schemas/api.schema";

export function useRegions() {
  return useQuery({
    queryKey: storeKeys.regions(),
    queryFn: ({ signal }) =>
      apiRequest({
        path: "/regions",
        schema: RegionsSchema,
        signal,
      }),
    // Regions are effectively static for the lifetime of the session.
    staleTime: Infinity,
  });
}
