"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export function ErrorBoundaryFallback({ error, reset, title = "Something went wrong" }: ErrorBoundaryProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-3 sm:px-4">
      <div className="text-center max-w-xs sm:max-w-md">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 sm:mb-6">
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
