import { useState, useCallback, useEffect } from "react";
import { useCompareStore } from "~/store/compare.store";
import { getVehicleById } from "~/api/vehicles.api";
import type { Vehicle } from "~/interface/vehicle.interface";
import { MAX_COMPARE_VEHICLES } from "~/constants/compare.constants";

/**
 * Encapsulates all compare-page logic:
 * - Fetches vehicle data from persisted IDs on mount
 * - Add / remove / clear operations
 * - Search modal state
 * - Loading & error state
 */
export function useCompareActions() {
  const {
    vehicleIds,
    vehicles,
    isLoading,
    error,
    addVehicle,
    removeVehicle,
    clearAll,
    setVehicles,
    setLoading,
    setError,
  } = useCompareStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ── Fetch vehicles from persisted IDs ───────────────────────────────────────
  useEffect(() => {
    if (vehicleIds.length === 0) {
      setVehicles([]);
      return;
    }

    // Skip if we already have all vehicles loaded
    const loadedIds = new Set(vehicles.map((v) => v.id));
    const needsFetch = vehicleIds.some((id) => !loadedIds.has(id));
    if (!needsFetch && vehicles.length === vehicleIds.length) return;

    let cancelled = false;

    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled(
          vehicleIds.map((id) => getVehicleById(id)),
        );

        if (cancelled) return;

        const fetched: Vehicle[] = [];
        const failedIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            fetched.push(result.value);
          } else {
            failedIds.push(vehicleIds[index]);
          }
        });

        setVehicles(fetched);

        // Auto-remove IDs that failed to fetch (e.g. deleted listings)
        failedIds.forEach((id) => removeVehicle(id));

        if (failedIds.length > 0 && fetched.length === 0) {
          setError("Could not load any vehicles for comparison.");
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load vehicles. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchVehicles();

    return () => {
      cancelled = true;
    };
    // Only re-fetch when IDs change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleIds.join(",")]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAddVehicle = useCallback(
    (vehicle: Vehicle) => {
      if (vehicleIds.length >= MAX_COMPARE_VEHICLES) return;
      addVehicle(vehicle.id);
      setVehicles([...vehicles, vehicle]);
      setIsSearchOpen(false);
    },
    [vehicleIds, vehicles, addVehicle, setVehicles],
  );

  const handleRemoveVehicle = useCallback(
    (id: number) => {
      removeVehicle(id);
    },
    [removeVehicle],
  );

  const handleClearAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  return {
    vehicles,
    vehicleIds,
    isLoading,
    error,
    isSearchOpen,
    canAddMore: vehicleIds.length < MAX_COMPARE_VEHICLES,
    handleAddVehicle,
    handleRemoveVehicle,
    handleClearAll,
    openSearch,
    closeSearch,
  } as const;
}
