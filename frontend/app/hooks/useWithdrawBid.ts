import { useState, useCallback } from "react";
import { useRevalidator } from "react-router";
import { withdrawBid } from "~/api/bids.api";

// ─── useWithdrawBid ───────────────────────────────────────────────────────────

export function useWithdrawBid() {
  const revalidator = useRevalidator();
  const [withdrawLoading, setWithdrawLoading] = useState<number | null>(null);

  const handleWithdraw = useCallback(
    async (bidId: number) => {
      setWithdrawLoading(bidId);
      try {
        await withdrawBid(bidId);
        revalidator.revalidate();
      } catch {
        // Silently fail — could add toast here
      } finally {
        setWithdrawLoading(null);
      }
    },
    [revalidator],
  );

  return { withdrawLoading, handleWithdraw } as const;
}
