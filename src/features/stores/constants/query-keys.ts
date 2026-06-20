import type { StoreQuery } from "@/schemas/query.schema";

/**
 * Hierarchical query keys for the stores domain. The nesting allows targeted
 * cache invalidation (e.g. invalidate every list, or a single detail).
 */
export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: (filters: StoreQuery) => [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, "detail"] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  regions: () => [...storeKeys.all, "regions"] as const,
};
