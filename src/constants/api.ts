export const API_ERROR_CODES = {
  STORE_NOT_FOUND: "STORE_NOT_FOUND",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  INVALID_QUERY: "INVALID_QUERY",
  INVALID_DATA: "INVALID_DATA",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export const STORE_SORT_FIELDS = [
  "name",
  "city",
  "region",
  "totalSales",
  "productsSold",
] as const;

export const SORT_ORDERS = ["asc", "desc"] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export const DEFAULT_SORT_ORDER: SortOrder = "asc";

export const TOP_PRODUCTS_LIMIT = 5;
