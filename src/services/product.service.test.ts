import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/data.service", () => ({
  getProductsData: vi.fn(),
}));

import { getProductsData } from "@/services/data.service";
import { getProducts } from "@/services/product.service";

const products = [
  {
    id: "p1",
    sku: "SKU-1001",
    name: "Wireless Mouse",
    category: "Electronics",
  },
  { id: "p2", sku: "SKU-2001", name: "Standing Desk", category: "Office" },
  { id: "p3", sku: "SKU-3001", name: "Yoga Mat", category: "Sports" },
];

beforeEach(() => {
  vi.mocked(getProductsData).mockResolvedValue(products);
});

describe("getProducts", () => {
  it("returns all products without filters", async () => {
    expect(await getProducts()).toHaveLength(3);
  });

  it("filters by name (case-insensitive)", async () => {
    const result = await getProducts({ search: "desk" });
    expect(result.map((product) => product.id)).toEqual(["p2"]);
  });

  it("filters by SKU substring", async () => {
    const result = await getProducts({ sku: "3001" });
    expect(result.map((product) => product.id)).toEqual(["p3"]);
  });

  it("filters by exact category (case-insensitive)", async () => {
    const result = await getProducts({ category: "electronics" });
    expect(result.map((product) => product.id)).toEqual(["p1"]);
  });
});
