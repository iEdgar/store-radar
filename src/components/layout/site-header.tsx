import Link from "next/link";

import { Store } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center px-4">
        <Link
          href="/"
          className="focus-visible:ring-ring flex items-center gap-2 rounded-sm font-semibold tracking-tight outline-none focus-visible:ring-2"
        >
          <Store className="text-primary size-5" aria-hidden="true" />
          <span>Retail Analytics</span>
        </Link>
      </div>
    </header>
  );
}
