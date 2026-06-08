import { useState, useCallback } from "react";
import { useRevalidator } from "react-router";
import { deleteBid } from "~/api/bids.api";

// ─── useRemoveBid ─────────────────────────────────────────────────────────────

export function useRemoveBid() {
  const revalidator = useRevalidator();
  const [removeLoading, setRemoveLoading] = useState<number | null>(null);

  const handleRemove = useCallback(
    async (bidId: number) => {
      setRemoveLoading(bidId);
      try {
        await deleteBid(bidId);
        revalidator.revalidate();
      } catch {
        // Silently fail — could add toast here
      } finally {
        setRemoveLoading(null);
      }
    },
    [revalidator],
  );

  return { removeLoading, handleRemove } as const;
}
