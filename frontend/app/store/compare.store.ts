import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompareState } from "~/interface/compare.interface";
import { MAX_COMPARE_VEHICLES } from "~/constants/compare.constants";

export const useCompareStore = create<CompareState>()(
  persist<CompareState>(
    (set, get) => ({
      vehicleIds: [],
      vehicles: [],
      isLoading: false,
      error: null,

      addVehicle: (id: number) => {
        const { vehicleIds } = get();
        if (vehicleIds.includes(id)) return;
        if (vehicleIds.length >= MAX_COMPARE_VEHICLES) return;
        set({ vehicleIds: [...vehicleIds, id] });
      },

      removeVehicle: (id: number) => {
        const { vehicleIds, vehicles } = get();
        set({
          vehicleIds: vehicleIds.filter((vid) => vid !== id),
          vehicles: vehicles.filter((v) => v.id !== id),
        });
      },

      clearAll: () => {
        set({ vehicleIds: [], vehicles: [], error: null });
      },

      setVehicles: (vehicles) => {
        set({ vehicles });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      hasVehicle: (id: number) => {
        return get().vehicleIds.includes(id);
      },
    }),
    {
      name: "compare-storage",
      // Only persist vehicleIds — vehicles are re-fetched on mount
      partialize: (state) =>
        ({
          vehicleIds: state.vehicleIds,
        }) as CompareState,
    },
  ),
);
