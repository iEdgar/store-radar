import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/utils/format";
import type { ProductSales } from "@/types/api";

export const storeProductColumns: ColumnDef<ProductSales>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.category}</Badge>
    ),
  },
  {
    accessorKey: "unitsSold",
    header: "Units Sold",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatNumber(row.original.unitsSold)}
      </span>
    ),
  },
  {
    accessorKey: "totalRevenue",
    header: "Total Revenue",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.totalRevenue)}
      </span>
    ),
  },
];

/** Filters products by name or SKU (case-insensitive). Lives in the feature so
 * the DataTable stays domain-agnostic. */
export function filterProductsByQuery(
  products: ProductSales[],
  query: string,
): ProductSales[] {
  const term = query.trim().toLowerCase();
  if (!term) {
    return products;
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term),
  );
}
