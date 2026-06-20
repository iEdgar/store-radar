/**
 * Canonical names of the URL search params used across the app. Centralized to
 * avoid magic strings when reading from / writing to the URL.
 */
export const SEARCH_PARAMS = {
  search: "search",
  region: "region",
} as const;
