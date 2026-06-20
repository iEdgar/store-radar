"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { FilterSelectOption } from "@/components/shared/filter-select";
import { SEARCH_PARAMS } from "@/constants/search-params";
import { ALL_REGIONS_VALUE } from "@/features/dashboard/constants/filters";
import { useOverview } from "@/features/dashboard/hooks/use-overview";
import { useRegions } from "@/features/stores/hooks/use-regions";
import { useStores } from "@/features/stores/hooks/use-stores";
import { useDebounce } from "@/hooks/use-debounce";
import { buildQueryString } from "@/utils/url";

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Composition hook for the dashboard. Encapsulates the integration between the
 * filters, the URL (single source of truth) and the data hooks, so the page and
 * view stay thin. The return value is grouped by concern.
 */
export function useDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get(SEARCH_PARAMS.search) ?? "";
  const urlRegion = searchParams.get(SEARCH_PARAMS.region) ?? "";

  // Local input state for instant feedback; the URL stays the source of truth.
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [syncedUrlSearch, setSyncedUrlSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  // Sync the input when the URL changes externally (e.g. back/forward) using the
  // render-time state-adjustment pattern (avoids setState inside an effect).
  if (urlSearch !== syncedUrlSearch) {
    setSyncedUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  const commitParams = useCallback(
    (next: { search?: string; region?: string }) => {
      const query = buildQueryString({
        [SEARCH_PARAMS.search]: next.search,
        [SEARCH_PARAMS.region]: next.region,
      });
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [router, pathname],
  );

  // Commit the debounced search term to the URL.
  useEffect(() => {
    if (debouncedSearch === urlSearch) {
      return;
    }
    commitParams({
      search: debouncedSearch || undefined,
      region: urlRegion || undefined,
    });
  }, [debouncedSearch, urlSearch, urlRegion, commitParams]);

  const onRegionChange = useCallback(
    (value: string) => {
      const region = value === ALL_REGIONS_VALUE ? undefined : value;
      commitParams({ search: searchInput || undefined, region });
    },
    [commitParams, searchInput],
  );

  const onClearFilters = useCallback(() => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const stores = useStores({
    search: urlSearch || undefined,
    region: urlRegion || undefined,
  });
  const overview = useOverview();
  const regionsQuery = useRegions();

  const regionOptions: FilterSelectOption[] = [
    { label: "All regions", value: ALL_REGIONS_VALUE },
    ...(regionsQuery.data ?? []).map((region) => ({
      label: region,
      value: region,
    })),
  ];

  return {
    filters: {
      search: searchInput,
      onSearchChange: setSearchInput,
      region: urlRegion || ALL_REGIONS_VALUE,
      onRegionChange,
      regionOptions,
      hasActiveFilters: Boolean(urlSearch || urlRegion),
      onClearFilters,
    },
    overview,
    stores,
  };
}
