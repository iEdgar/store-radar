import { readFile } from "node:fs/promises";
import path from "node:path";

import { API_ERROR_CODES } from "@/constants/api";
import { ApiError } from "@/lib/api-error";
import { ProductsSchema } from "@/schemas/product.schema";
import { StoreProductSalesCollectionSchema } from "@/schemas/sales.schema";
import { StoresSchema } from "@/schemas/store.schema";
import type { Product } from "@/types/product";
import type { StoreProductSales } from "@/types/sales";
import type { Store } from "@/types/store";
import type { ZodType } from "zod";

const DATA_DIR = path.join(process.cwd(), "data");
const INVALID_DATA_STATUS = 500;

async function readJsonFile(fileName: string): Promise<unknown> {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

/**
 * Reads a dataset file and validates it against its schema immediately, so the
 * rest of the application only ever works with trusted, typed domain data.
 */
async function loadDataset<T>(
  fileName: string,
  schema: ZodType<T>,
): Promise<T> {
  const json = await readJsonFile(fileName);
  const result = schema.safeParse(json);

  if (!result.success) {
    throw new ApiError(
      API_ERROR_CODES.INVALID_DATA,
      `Dataset "${fileName}" failed validation.`,
      INVALID_DATA_STATUS,
    );
  }

  return result.data;
}

export function getStoresData(): Promise<Store[]> {
  return loadDataset("stores.json", StoresSchema);
}

export function getProductsData(): Promise<Product[]> {
  return loadDataset("products.json", ProductsSchema);
}

export function getSalesData(): Promise<StoreProductSales[]> {
  return loadDataset(
    "store-product-sales.json",
    StoreProductSalesCollectionSchema,
  );
}
