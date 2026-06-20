"use client";

import { ErrorState } from "@/components/shared/error-state";

interface StoreDetailErrorProps {
  error: Error;
  reset: () => void;
}

export default function StoreDetailError({ reset }: StoreDetailErrorProps) {
  return (
    <ErrorState
      title="Something went wrong"
      description="We couldn't display this store. Please try again."
      onRetry={reset}
    />
  );
}
