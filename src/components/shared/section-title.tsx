import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  title: string;
  description?: string;
  as?: "h2" | "h3";
  /** Optional id applied to the heading, e.g. to wire `aria-labelledby`. */
  id?: string;
  actions?: ReactNode;
  className?: string;
}

export function SectionTitle({
  title,
  description,
  as: Heading = "h2",
  id,
  actions,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <Heading id={id} className="text-lg font-medium tracking-tight">
          {title}
        </Heading>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
