import { getProductsData } from "@/services/data.service";
import type { ProductQuery } from "@/schemas/query.schema";
import type { Product } from "@/types/product";

/**
 * Returns all products, applying the optional name search, SKU search and
 * category filter.
 */
export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  let products = await getProductsData();

  if (query.search) {
    const term = query.search.toLowerCase();
    products = products.filter((product) =>
      product.name.toLowerCase().includes(term),
    );
  }

  if (query.sku) {
    const term = query.sku.toLowerCase();
    products = products.filter((product) =>
      product.sku.toLowerCase().includes(term),
    );
  }

  if (query.category) {
    const category = query.category.toLowerCase();
    products = products.filter(
      (product) => product.category.toLowerCase() === category,
    );
  }

  return products;
}
