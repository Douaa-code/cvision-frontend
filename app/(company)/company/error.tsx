"use client";

import { ErrorBoundaryFallback } from "@/components/shared/ErrorBoundary";

export default function CompanyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundaryFallback error={error} reset={reset} title="Company Portal Error" />;
}

//updat