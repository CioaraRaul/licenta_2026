import type { Vehicle, ViewMode } from './vehicle.interface';

// ─── SavedVehicle entity ──────────────────────────────────────────────────────

export interface SavedVehicle {
  id: number;
  userId: number;
  vehicleId: number;

  /** Populated vehicle object returned by the API */
  vehicle: Vehicle;

  savedAt: string;
}

// ─── Check response ───────────────────────────────────────────────────────────

export interface IsSavedResponse {
  isSaved: boolean;
}

// ─── Saved vehicles page ──────────────────────────────────────────────────────

export interface SavedVehiclesPageData {
  vehicles: Vehicle[];
  total: number;
  page: number;
  error: boolean;
}

export interface SavedVehiclesProps {
  vehicles: Vehicle[];
  total: number;
  page: number;
  error: boolean;
}
