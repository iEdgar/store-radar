import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  label?: string;
}

/**
 * A table-shaped loading placeholder that mirrors the final table layout, so
 * the skeleton → content transition feels seamless.
 */
export function TableSkeleton({
  rows = 6,
  columns = 5,
  label = "Loading…",
}: TableSkeletonProps) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <Table aria-hidden="true">
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }, (_, columnIndex) => (
              <TableHead key={columnIndex}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }, (_, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Skeleton className="h-4 w-full max-w-32" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
