"use client";

import { ErrorBoundaryFallback } from "@/components/shared/ErrorBoundary";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBoundaryFallback error={error} reset={reset} title="Admin Panel Error" />;
}
