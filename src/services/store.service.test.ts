import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/data.service", () => ({
  getStoresData: vi.fn(),
  getProductsData: vi.fn(),
  getSalesData: vi.fn(),
}));

import { ApiError } from "@/lib/api-error";
import {
  getProductsData,
  getSalesData,
  getStoresData,
} from "@/services/data.service";
import {
  getOverview,
  getRegions,
  getStoreDetail,
  getStores,
} from "@/services/store.service";

const stores = [
  { id: "s1", name: "Alpha Store", city: "New York", region: "East" },
  { id: "s2", name: "Beta Store", city: "Los Angeles", region: "West" },
];
const products = [
  { id: "p1", sku: "SKU-1", name: "Mouse", category: "Electronics" },
  { id: "p2", sku: "SKU-2", name: "Desk", category: "Office" },
];
const sales = [
  {
    id: "m1",
    storeId: "s1",
    productId: "p1",
    unitsSold: 10,
    totalRevenue: 100,
  },
  { id: "m2", storeId: "s1", productId: "p2", unitsSold: 5, totalRevenue: 250 },
  {
    id: "m3",
    storeId: "s2",
    productId: "p1",
    unitsSold: 20,
    totalRevenue: 200,
  },
];

beforeEach(() => {
  vi.mocked(getStoresData).mockResolvedValue(stores);
  vi.mocked(getProductsData).mockResolvedValue(products);
  vi.mocked(getSalesData).mockResolvedValue(sales);
});

describe("getStores", () => {
  it("aggregates sales metrics per store", async () => {
    const result = await getStores();
    const s1 = result.find((store) => store.id === "s1");
    const s2 = result.find((store) => store.id === "s2");

    expect(s1?.totalSales).toBe(350);
    expect(s1?.productsSold).toBe(15);
    expect(s2?.totalSales).toBe(200);
    expect(s2?.productsSold).toBe(20);
  });

  it("filters by store name (case-insensitive)", async () => {
    const result = await getStores({ search: "alpha" });
    expect(result.map((store) => store.id)).toEqual(["s1"]);
  });

  it("filters by region", async () => {
    const result = await getStores({ region: "west" });
    expect(result.map((store) => store.id)).toEqual(["s2"]);
  });

  it("sorts by total sales descending", async () => {
    const result = await getStores({ sort: "totalSales", order: "desc" });
    expect(result.map((store) => store.id)).toEqual(["s1", "s2"]);
  });
});

describe("getStoreDetail", () => {
  it("computes the summary, top products and product breakdown", async () => {
    const detail = await getStoreDetail("s1");

    expect(detail.store.id).toBe("s1");
    expect(detail.summary.totalSales).toBe(350);
    expect(detail.summary.productsSold).toBe(15);
    expect(detail.summary.totalCategories).toBe(2);
    expect(detail.summary.averageRevenuePerProduct).toBe(175);
    expect(detail.products).toHaveLength(2);
    expect(detail.topProducts[0].totalRevenue).toBe(250);
  });

  it("throws STORE_NOT_FOUND for an unknown id", async () => {
    await expect(getStoreDetail("missing")).rejects.toBeInstanceOf(ApiError);
    await expect(getStoreDetail("missing")).rejects.toMatchObject({
      code: "STORE_NOT_FOUND",
      status: 404,
    });
  });
});

describe("getOverview", () => {
  it("computes the global KPIs", async () => {
    const overview = await getOverview();

    expect(overview.totalRevenue).toBe(550);
    expect(overview.totalProductsSold).toBe(35);
    expect(overview.storeCount).toBe(2);
    expect(overview.categoriesCount).toBe(2);
  });
});

describe("getRegions", () => {
  it("returns the distinct regions sorted ascending", async () => {
    expect(await getRegions()).toEqual(["East", "West"]);
  });
});
