import { z } from "zod";

import { StoreSchema } from "@/schemas/store.schema";

export const StoreSummarySchema = StoreSchema.extend({
  totalSales: z.number(),
  productsSold: z.number(),
});

export const StoreSummaryListSchema = z.array(StoreSummarySchema);

export const ProductSalesSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  unitsSold: z.number(),
  totalRevenue: z.number(),
});

export const StoreDetailSummarySchema = z.object({
  totalSales: z.number(),
  productsSold: z.number(),
  totalCategories: z.number(),
  averageRevenuePerProduct: z.number(),
});

export const StoreDetailSchema = z.object({
  store: StoreSchema,
  summary: StoreDetailSummarySchema,
  topProducts: z.array(ProductSalesSchema),
  products: z.array(ProductSalesSchema),
});

export const RegionsSchema = z.array(z.string());

export const OverviewSchema = z.object({
  totalRevenue: z.number(),
  totalProductsSold: z.number(),
  storeCount: z.number(),
  categoriesCount: z.number(),
  revenueByRegion: z.array(
    z.object({
      region: z.string(),
      totalRevenue: z.number(),
    }),
  ),
});

export const ApiMetaSchema = z.object({
  count: z.number().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  totalItems: z.number().optional(),
  totalPages: z.number().optional(),
});

/**
 * Builds the success-envelope schema for a given data schema, so every response
 * shares one validated `{ success, data, meta }` contract without duplication.
 */
export function apiSuccessSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: ApiMetaSchema.optional(),
  });
}

export const ApiErrorBodySchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

/**
 * Success envelope with an unvalidated `data` field. The API client validates
 * the envelope shape with this schema and then validates `data` against the
 * per-request schema, keeping one canonical envelope definition.
 */
export const UnknownApiSuccessSchema = apiSuccessSchema(z.unknown());
