import Link from "next/link";

import { SearchX } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";

export function StoreNotFound() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Store not found" },
        ]}
      />
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-16 text-center">
        <SearchX className="text-muted-foreground size-10" aria-hidden="true" />
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold">Store not found</h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            We couldn&apos;t find the store you&apos;re looking for. It may have
            been removed, or the link may be incorrect.
          </p>
        </div>
        <Button render={<Link href="/" />}>Back to dashboard</Button>
      </div>
    </div>
  );
}
