import type { Vehicle } from "./vehicle.interface";

export interface CompareState {
  /** Vehicle IDs currently selected for comparison */
  vehicleIds: number[];
  /** Resolved vehicle objects (fetched lazily) */
  vehicles: Vehicle[];
  /** Loading flag while fetching vehicles */
  isLoading: boolean;
  /** Error message if fetch fails */
  error: string | null;

  addVehicle: (id: number) => void;
  removeVehicle: (id: number) => void;
  clearAll: () => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hasVehicle: (id: number) => boolean;
}
