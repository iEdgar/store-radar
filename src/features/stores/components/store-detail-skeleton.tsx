import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const SUMMARY_CARD_COUNT = 4;
const TOP_PRODUCT_ROWS = 5;

export function StoreDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {/* Breadcrumb placeholder — no temporary text while the name loads */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <span className="text-muted-foreground" aria-hidden="true">
            /
          </span>
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: SUMMARY_CARD_COUNT }, (_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-4 rounded-xl border p-4">
          {Array.from({ length: TOP_PRODUCT_ROWS }, (_, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <TableSkeleton rows={6} columns={5} label="Loading products" />
      </div>
    </div>
  );
}
