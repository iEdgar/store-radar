import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  /** Already-formatted value (formatting is the feature's responsibility). */
  value: ReactNode;
  icon?: LucideIcon;
  helperText?: string;
  /** Optional slot for additional content in future iterations. */
  children?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  helperText,
  children,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("gap-2", className)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        {Icon ? (
          <CardAction>
            <Icon className="text-muted-foreground size-5" aria-hidden="true" />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {helperText ? (
          <p className="text-muted-foreground text-xs">{helperText}</p>
        ) : null}
        {children}
      </CardContent>
    </Card>
  );
}
