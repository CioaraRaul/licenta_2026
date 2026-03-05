import { httpClient } from './http.api';
import type {
  SavedVehicle,
  IsSavedResponse,
} from '~/interface/saved-vehicle.interface';
import type { PaginatedResponse } from '~/interface/vehicle.interface';

/** POST /saved-vehicles/:vehicleId — salvează un vehicul în favorite */
export async function saveVehicle(vehicleId: number): Promise<SavedVehicle> {
  return httpClient.post<SavedVehicle>(`/saved-vehicles/${vehicleId}`);
}

/** DELETE /saved-vehicles/:vehicleId — elimină vehiculul din favorite */
export async function unsaveVehicle(vehicleId: number): Promise<void> {
  return httpClient.delete<void>(`/saved-vehicles/${vehicleId}`);
}

/** GET /saved-vehicles — lista vehiculelor salvate cu paginare */
export async function getSavedVehicles(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<SavedVehicle>> {
  return httpClient.get<PaginatedResponse<SavedVehicle>>(
    `/saved-vehicles?page=${page}&limit=${limit}`,
  );
}

/** GET /saved-vehicles/check/:vehicleId — verifică dacă un vehicul e salvat */
export async function checkIsSaved(vehicleId: number): Promise<IsSavedResponse> {
  return httpClient.get<IsSavedResponse>(`/saved-vehicles/check/${vehicleId}`);
}
