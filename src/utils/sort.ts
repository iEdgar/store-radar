import type { SortOrder } from "@/constants/api";

/**
 * Returns a new array sorted by the given field. Numeric fields are compared
 * numerically; everything else is compared as a locale-aware string.
 */
export function sortByField<T>(
  items: T[],
  field: keyof T,
  order: SortOrder = "asc",
): T[] {
  const direction = order === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * direction;
    }

    return String(aValue).localeCompare(String(bValue)) * direction;
  });
}
