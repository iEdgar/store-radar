import { z } from "zod";

import { SORT_ORDERS, STORE_SORT_FIELDS } from "@/constants/api";

export const StoreQuerySchema = z.object({
  search: z.string().trim().optional(),
  region: z.string().trim().optional(),
  sort: z.enum(STORE_SORT_FIELDS).optional(),
  order: z.enum(SORT_ORDERS).optional(),
});

export type StoreQuery = z.infer<typeof StoreQuerySchema>;

export const ProductQuerySchema = z.object({
  search: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  category: z.string().trim().optional(),
});

export type ProductQuery = z.infer<typeof ProductQuerySchema>;
