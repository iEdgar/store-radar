import { Suspense } from "react";

import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardView />
    </Suspense>
  );
}
