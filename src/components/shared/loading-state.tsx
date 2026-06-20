import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  rows?: number;
  label?: string;
  className?: string;
}

export function LoadingState({
  rows = 3,
  label = "Loading…",
  className,
}: LoadingStateProps) {
  return (
    <div role="status" aria-busy="true" className={cn("space-y-3", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
