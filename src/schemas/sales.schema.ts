import { z } from "zod";

export const StoreProductSalesSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  productId: z.string(),
  unitsSold: z.number().int().min(0),
  totalRevenue: z.number().min(0),
});

export const StoreProductSalesCollectionSchema = z.array(
  StoreProductSalesSchema,
);
