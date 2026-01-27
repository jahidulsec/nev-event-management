"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-svh flex flex-col justify-center items-center gap-3 font-mono">
      <h2 className="text-xl font-medium text-destructive">
        {error.name ?? "Error"}
      </h2>
      <p className="max-w-lg text-wrap text-center text-sm p-3 bg-muted/50">
        {error?.message ?? "Something Went Wrong"}
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
