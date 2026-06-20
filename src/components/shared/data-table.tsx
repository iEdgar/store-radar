"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  RowData,
  SortDirection,
  SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Horizontal alignment applied to the column's header and cells. */
    align?: "left" | "right";
  }
}

/**
 * Generic, domain-agnostic table built on TanStack Table. It owns only the
 * internal table behavior (sorting, row models, rendering). Search/filtering,
 * column definitions and formatting are the consuming feature's responsibility.
 *
 * The contract is intentionally small but extension-ready: pagination, row
 * selection, column visibility or a toolbar can be added later by wiring the
 * corresponding TanStack row models/state without breaking existing callers.
 */
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialSorting?: SortingState;
  caption?: string;
  emptyState?: ReactNode;
}

function getSortAriaLabel(label: string, sort: SortDirection | false): string {
  if (sort === "asc") return `${label}, sorted ascending`;
  if (sort === "desc") return `${label}, sorted descending`;
  return `${label}, not sorted`;
}

function SortIndicator({ sort }: { sort: SortDirection | false }) {
  if (sort === "asc") {
    return <ArrowUp className="size-3.5" aria-hidden="true" />;
  }
  if (sort === "desc") {
    return <ArrowDown className="size-3.5" aria-hidden="true" />;
  }
  return (
    <ChevronsUpDown
      className="text-muted-foreground size-3.5"
      aria-hidden="true"
    />
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialSorting = [],
  caption,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  // TanStack Table's useReactTable returns non-memoizable functions, so the
  // React Compiler safely skips optimizing this component. Suppress the advisory.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <Table>
      {caption ? (
        <TableCaption className="sr-only">{caption}</TableCaption>
      ) : null}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canSort = header.column.getCanSort();
              const sort = header.column.getIsSorted();
              const align = header.column.columnDef.meta?.align;
              const label =
                typeof header.column.columnDef.header === "string"
                  ? header.column.columnDef.header
                  : header.column.id;

              return (
                <TableHead
                  key={header.id}
                  scope="col"
                  aria-sort={
                    canSort
                      ? sort === "asc"
                        ? "ascending"
                        : sort === "desc"
                          ? "descending"
                          : "none"
                      : undefined
                  }
                  className={cn(align === "right" && "text-right")}
                >
                  {header.isPlaceholder ? null : canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label={getSortAriaLabel(label, sort)}
                      className={cn(
                        "text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm font-medium transition-colors outline-none focus-visible:ring-2",
                        align === "right" && "flex-row-reverse",
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <SortIndicator sort={sort} />
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const align = cell.column.columnDef.meta?.align;
                return (
                  <TableCell
                    key={cell.id}
                    className={cn(align === "right" && "text-right")}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="p-0">
              {emptyState ?? null}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
