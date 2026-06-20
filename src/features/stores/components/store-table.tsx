import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/utils/format";
import type { StoreSummary } from "@/types/api";

export interface StoreTableProps {
  stores: StoreSummary[];
}

export function StoreTable({ stores }: StoreTableProps) {
  return (
    <Table>
      <TableCaption className="sr-only">
        Stores and their sales performance
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Store</TableHead>
          <TableHead scope="col">City</TableHead>
          <TableHead scope="col">Region</TableHead>
          <TableHead scope="col" className="text-right">
            Total Sales
          </TableHead>
          <TableHead scope="col" className="text-right">
            Products Sold
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.map((store) => (
          <TableRow key={store.id}>
            <TableCell>
              <Link
                href={`/stores/${store.id}`}
                className="text-primary group inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline focus-visible:underline"
              >
                {store.name}
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </TableCell>
            <TableCell>{store.city}</TableCell>
            <TableCell>{store.region}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(store.totalSales)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(store.productsSold)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
