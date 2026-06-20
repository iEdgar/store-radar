import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/format";
import type { ProductSales } from "@/types/api";

export interface TopProductsProps {
  products: ProductSales[];
}

export function TopProducts({ products }: TopProductsProps) {
  const maxRevenue = products.reduce(
    (max, product) => Math.max(max, product.totalRevenue),
    0,
  );

  return (
    <Card>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No products to display yet.
          </p>
        ) : (
          <ol className="space-y-4">
            {products.map((product, index) => {
              const widthPercent =
                maxRevenue > 0 ? (product.totalRevenue / maxRevenue) * 100 : 0;

              return (
                <li key={product.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-muted-foreground w-4 text-sm tabular-nums">
                        {index + 1}
                      </span>
                      <span className="truncate font-medium">
                        {product.name}
                      </span>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium tabular-nums">
                        {formatCurrency(product.totalRevenue)}
                      </div>
                      <div className="text-muted-foreground text-xs tabular-nums">
                        {formatNumber(product.unitsSold)} units
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
                    aria-hidden="true"
                  >
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
