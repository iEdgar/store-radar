import type { z } from "zod";

import type {
  ApiErrorBodySchema,
  ApiMetaSchema,
  OverviewSchema,
  ProductSalesSchema,
  StoreDetailSchema,
  StoreDetailSummarySchema,
  StoreSummarySchema,
} from "@/schemas/api.schema";

export type ApiMeta = z.infer<typeof ApiMetaSchema>;

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>;

export type StoreSummary = z.infer<typeof StoreSummarySchema>;

export type ProductSales = z.infer<typeof ProductSalesSchema>;

export type StoreDetailSummary = z.infer<typeof StoreDetailSummarySchema>;

export type StoreDetail = z.infer<typeof StoreDetailSchema>;

export type Overview = z.infer<typeof OverviewSchema>;
