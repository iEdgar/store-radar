"use client";

import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";

const REGION_FILTER_ID = "region-filter";

export interface DashboardFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  region: string;
  onRegionChange: (value: string) => void;
  regionOptions: FilterSelectOption[];
}

export function DashboardFilters({
  search,
  onSearchChange,
  region,
  onRegionChange,
  regionOptions,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <SearchInput
        className="sm:max-w-xs"
        value={search}
        onValueChange={onSearchChange}
        placeholder="Search stores…"
        label="Search stores"
      />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={REGION_FILTER_ID}
          className="text-muted-foreground text-xs font-medium"
        >
          Region
        </label>
        <FilterSelect
          id={REGION_FILTER_ID}
          className="sm:w-48"
          label="Region"
          value={region}
          onValueChange={onRegionChange}
          options={regionOptions}
        />
      </div>
    </div>
  );
}
