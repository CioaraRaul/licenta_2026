import { useState, useCallback } from "react";
import { useRevalidator } from "react-router";
import {
  deactivateVehicle,
  reactivateVehicle,
  markVehicleSold,
  deleteVehicle,
} from "~/api/vehicles.api";

// ─── useListingActions ────────────────────────────────────────────────────────

/**
 * Encapsulates all listing mutation logic (deactivate, reactivate,
 * mark-as-sold, delete) together with their shared loading / menu state.
 *
 * Returns:
 * - `actionLoading`  — id of the vehicle currently being mutated (or null)
 * - `openMenuId`     — id of the vehicle whose action menu is open (or null)
 * - `setOpenMenuId`  — setter so the component can toggle menus
 * - `handleDeactivate / handleReactivate / handleMarkSold / handleDelete`
 */
export function useListingActions() {
  const revalidator = useRevalidator();

  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // ── Generic executor ──────────────────────────────────────────────────
  const performAction = useCallback(
    async (action: () => Promise<unknown>, vehicleId: number) => {
      setActionLoading(vehicleId);
      setOpenMenuId(null);
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
  const handleDeactivate = useCallback(
    (id: number) => performAction(() => deactivateVehicle(id), id),
    [performAction],
  );

  const handleReactivate = useCallback(
    (id: number) => performAction(() => reactivateVehicle(id), id),
    [performAction],
  );

  const handleMarkSold = useCallback(
    (id: number) => performAction(() => markVehicleSold(id), id),
    [performAction],
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (
        !window.confirm(
          "Are you sure you want to permanently delete this listing?",
        )
      )
        return;
      performAction(() => deleteVehicle(id), id);
    },
    [performAction],
  );

  return {
    actionLoading,
    openMenuId,
    setOpenMenuId,
    handleDeactivate,
    handleReactivate,
    handleMarkSold,
    handleDelete,
  } as const;
}
