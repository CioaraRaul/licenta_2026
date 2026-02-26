import { httpClient } from "./http.api";
import type {
  Vehicle,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  FilterVehicleParams,
  PaginatedResponse,
  MyListingsApiResponse,
} from "~/interface/vehicle.interface";

// ─── Public endpoints ─────────────────────────────────────────────────────────

/** GET /vehicles — listare cu filtre și paginare */
export async function getVehicles(
  params?: FilterVehicleParams,
): Promise<PaginatedResponse<Vehicle>> {
  return httpClient.get<PaginatedResponse<Vehicle>>("/vehicles", { params });
}

/** GET /vehicles/featured — vehicule promovate */
export async function getFeaturedVehicles(limit = 10): Promise<Vehicle[]> {
  return httpClient.get<Vehicle[]>("/vehicles/featured", { params: { limit } });
}

/** GET /vehicles/:id — detalii vehicul */
export async function getVehicleById(id: number): Promise<Vehicle> {
  return httpClient.get<Vehicle>(`/vehicles/${id}`);
}

/** GET /vehicles/:id/similar — vehicule similare */
export async function getSimilarVehicles(
  id: number,
  limit = 5,
): Promise<Vehicle[]> {
  return httpClient.get<Vehicle[]>(`/vehicles/${id}/similar`, {
    params: { limit },
  });
}

// ─── Authenticated endpoints ──────────────────────────────────────────────────

/** GET /vehicles/my/listings — listările proprii (seller) cu paginare */
export async function getMyListings(
  page = 1,
  limit = 20,
): Promise<MyListingsApiResponse> {
  return httpClient.get<MyListingsApiResponse>("/vehicles/my/listings", {
    params: { page, limit },
  });
}

/** POST /vehicles — creare anunț nou */
export async function createVehicle(
  payload: CreateVehiclePayload,
): Promise<Vehicle> {
  return httpClient.post<Vehicle>("/vehicles", payload);
}

/** PATCH /vehicles/:id — actualizare anunț */
export async function updateVehicle(
  id: number,
  payload: UpdateVehiclePayload,
): Promise<Vehicle> {
  return httpClient.patch<Vehicle>(`/vehicles/${id}`, payload);
}

/** PATCH /vehicles/:id/deactivate — dezactivare anunț */
export async function deactivateVehicle(id: number): Promise<Vehicle> {
  return httpClient.patch<Vehicle>(`/vehicles/${id}/deactivate`);
}

/** PATCH /vehicles/:id/reactivate — reactivare anunț */
export async function reactivateVehicle(id: number): Promise<Vehicle> {
  return httpClient.patch<Vehicle>(`/vehicles/${id}/reactivate`);
}

/** PATCH /vehicles/:id/sold — marchează ca vândut */
export async function markVehicleSold(id: number): Promise<Vehicle> {
  return httpClient.patch<Vehicle>(`/vehicles/${id}/sold`);
}

/** DELETE /vehicles/:id — ștergere anunț */
export async function deleteVehicle(id: number): Promise<void> {
  return httpClient.delete<void>(`/vehicles/${id}`);
}
