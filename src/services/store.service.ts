import {
  API_ERROR_CODES,
  DEFAULT_SORT_ORDER,
  TOP_PRODUCTS_LIMIT,
} from "@/constants/api";
import { ApiError } from "@/lib/api-error";
import {
  getProductsData,
  getSalesData,
  getStoresData,
} from "@/services/data.service";
import { sortByField } from "@/utils/sort";
import type { StoreQuery } from "@/schemas/query.schema";
import type {
  Overview,
  ProductSales,
  StoreDetail,
  StoreDetailSummary,
  StoreSummary,
} from "@/types/api";
import type { Store } from "@/types/store";

const STORE_NOT_FOUND_STATUS = 404;

interface StoreTotals {
  totalSales: number;
  productsSold: number;
}

const emptyTotals = (): StoreTotals => ({ totalSales: 0, productsSold: 0 });

/**
 * Returns every store enriched with its aggregated sales metrics, applying the
 * optional search, region filter and sorting.
 */
export async function getStores(
  query: StoreQuery = {},
): Promise<StoreSummary[]> {
  const [stores, sales] = await Promise.all([getStoresData(), getSalesData()]);

  const totalsByStore = new Map<string, StoreTotals>();
  for (const sale of sales) {
    const totals = totalsByStore.get(sale.storeId) ?? emptyTotals();
    totals.totalSales += sale.totalRevenue;
    totals.productsSold += sale.unitsSold;
    totalsByStore.set(sale.storeId, totals);
  }

  let summaries: StoreSummary[] = stores.map((store) => ({
    ...store,
    ...(totalsByStore.get(store.id) ?? emptyTotals()),
  }));

  if (query.search) {
    const term = query.search.toLowerCase();
    summaries = summaries.filter((store) =>
      store.name.toLowerCase().includes(term),
    );
  }

  if (query.region) {
    const region = query.region.toLowerCase();
    summaries = summaries.filter(
      (store) => store.region.toLowerCase() === region,
    );
  }

  if (query.sort) {
    summaries = sortByField(
      summaries,
      query.sort,
      query.order ?? DEFAULT_SORT_ORDER,
    );
  }

  return summaries;
}

/**
 * Returns the full detail of a single store: the store entity, its computed
 * sales summary, the top selling products and the complete product breakdown.
 */
export async function getStoreDetail(storeId: string): Promise<StoreDetail> {
  const [stores, products, sales] = await Promise.all([
    getStoresData(),
    getProductsData(),
    getSalesData(),
  ]);

  const store = stores.find((candidate) => candidate.id === storeId);
  if (!store) {
    throw new ApiError(
      API_ERROR_CODES.STORE_NOT_FOUND,
      "Store not found.",
      STORE_NOT_FOUND_STATUS,
    );
  }

  const productById = new Map(products.map((product) => [product.id, product]));

  const productSales: ProductSales[] = sales
    .filter((sale) => sale.storeId === storeId)
    .map((sale) => {
      const product = productById.get(sale.productId);
      return {
        id: sale.productId,
        sku: product?.sku ?? "",
        name: product?.name ?? "",
        category: product?.category ?? "",
        unitsSold: sale.unitsSold,
        totalRevenue: sale.totalRevenue,
      };
    });

  const totalSales = productSales.reduce(
    (sum, product) => sum + product.totalRevenue,
    0,
  );
  const productsSold = productSales.reduce(
    (sum, product) => sum + product.unitsSold,
    0,
  );
  const productCount = productSales.length;
  const totalCategories = new Set(
    productSales.map((product) => product.category),
  ).size;

  const summary: StoreDetailSummary = {
    totalSales,
    productsSold,
    totalCategories,
    averageRevenuePerProduct: productCount > 0 ? totalSales / productCount : 0,
  };

  const topProducts = sortByField(productSales, "totalRevenue", "desc").slice(
    0,
    TOP_PRODUCTS_LIMIT,
  );

  return { store, summary, topProducts, products: productSales };
}

/**
 * Returns a single store entity by id (or null). Lightweight lookup used for
 * server-side metadata generation, avoiding the heavier detail aggregation.
 */
export async function getStoreById(storeId: string): Promise<Store | null> {
  const stores = await getStoresData();
  return stores.find((store) => store.id === storeId) ?? null;
}

/**
 * Returns the distinct regions present in the dataset, sorted ascending, so the
 * frontend can populate the region filter without hardcoded values.
 */
export async function getRegions(): Promise<string[]> {
  const stores = await getStoresData();
  const regions = new Set(stores.map((store) => store.region));

  return Array.from(regions).sort((a, b) => a.localeCompare(b));
}

/**
 * Returns the global business KPIs for the dashboard. These metrics describe the
 * whole dataset and are independent of any table filter.
 */
export async function getOverview(): Promise<Overview> {
  const [stores, products, sales] = await Promise.all([
    getStoresData(),
    getProductsData(),
    getSalesData(),
  ]);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
  const totalProductsSold = sales.reduce(
    (sum, sale) => sum + sale.unitsSold,
    0,
  );
  const categoriesCount = new Set(products.map((product) => product.category))
    .size;

  const regionByStore = new Map(
    stores.map((store) => [store.id, store.region]),
  );
  const revenueByRegionMap = new Map<string, number>();
  for (const sale of sales) {
    const region = regionByStore.get(sale.storeId);
    if (!region) {
      continue;
    }
    revenueByRegionMap.set(
      region,
      (revenueByRegionMap.get(region) ?? 0) + sale.totalRevenue,
    );
  }
  const revenueByRegion = Array.from(
    revenueByRegionMap,
    ([region, regionRevenue]) => ({ region, totalRevenue: regionRevenue }),
  ).sort((a, b) => b.totalRevenue - a.totalRevenue);

  return {
    totalRevenue,
    totalProductsSold,
    storeCount: stores.length,
    categoriesCount,
    revenueByRegion,
  };
}
