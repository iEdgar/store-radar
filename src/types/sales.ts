import type { z } from "zod";

import type { StoreProductSalesSchema } from "@/schemas/sales.schema";

export type StoreProductSales = z.infer<typeof StoreProductSalesSchema>;
