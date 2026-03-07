import { useState, useCallback } from "react";
import { useRevalidator } from "react-router";
import { acceptBid, rejectBid } from "~/api/bids.api";

// ─── useBidActions ────────────────────────────────────────────────────────────

export function useBidActions() {
  const revalidator = useRevalidator();

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ── Generic executor ──────────────────────────────────────────────────
  const performAction = useCallback(
    async (action: () => Promise<unknown>, bidId: number) => {
      setActionLoading(bidId);
      try {
        await action();
        revalidator.revalidate();
      } catch {
        // Silently fail — could add toast here
      } finally {
        setActionLoading(null);
      }
    },
    [revalidator],
  );

  // ── Concrete handlers ─────────────────────────────────────────────────
  const handleAccept = useCallback(
    (bidId: number) => performAction(() => acceptBid(bidId), bidId),
    [performAction],
  );

  const handleReject = useCallback(
    (bidId: number, reason?: string) =>
      performAction(() => rejectBid(bidId, reason), bidId),
    [performAction],
  );

  return {
    actionLoading,
    handleAccept,
    handleReject,
  } as const;
}
