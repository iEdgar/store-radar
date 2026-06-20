import { describe, expect, it } from "vitest";

import { filterProductsByQuery } from "@/features/stores/components/store-products-columns";
import type { ProductSales } from "@/types/api";

const products: ProductSales[] = [
  {
    id: "p1",
    sku: "SKU-1001",
    name: "Wireless Mouse",
    category: "Electronics",
    unitsSold: 10,
    totalRevenue: 100,
  },
  {
    id: "p2",
    sku: "SKU-2002",
    name: "Standing Desk",
    category: "Office",
    unitsSold: 5,
    totalRevenue: 250,
  },
];

describe("filterProductsByQuery", () => {
  it("returns all products when the query is empty or whitespace", () => {
    expect(filterProductsByQuery(products, "")).toHaveLength(2);
    expect(filterProductsByQuery(products, "   ")).toHaveLength(2);
  });

  it("matches by product name (case-insensitive)", () => {
    expect(filterProductsByQuery(products, "MOUSE").map((p) => p.id)).toEqual([
      "p1",
    ]);
  });

  it("matches by SKU", () => {
    expect(filterProductsByQuery(products, "2002").map((p) => p.id)).toEqual([
      "p2",
    ]);
  });

  it("returns nothing when there is no match", () => {
    expect(filterProductsByQuery(products, "keyboard")).toHaveLength(0);
  });
});
