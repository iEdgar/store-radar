import type { ProductQuery } from "@/schemas/query.schema";

/**
 * Hierarchical query keys for the products domain.
 */
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductQuery) => [...productKeys.lists(), filters] as const,
};
