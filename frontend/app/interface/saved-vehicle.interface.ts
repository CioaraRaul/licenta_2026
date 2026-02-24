import type { Vehicle } from './vehicle.interface';

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
