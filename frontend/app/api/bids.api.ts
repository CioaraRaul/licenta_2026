import { httpClient } from "./http.api";
import type {
  Bid,
  BidStatus,
  CreateBidPayload,
} from "~/interface/bid.interface";
import type { PaginatedResponse } from "~/interface/vehicle.interface";

// ─── Buyer endpoints ──────────────────────────────────────────────────────────

/** POST /bids/:vehicleId — plasează o ofertă pe un vehicul */
export async function placeBid(
  vehicleId: number,
  payload: CreateBidPayload,
): Promise<Bid> {
  return httpClient.post<Bid>(`/bids/${vehicleId}`, payload);
}

/** GET /bids/my — ofertele proprii (buyer) cu paginare */
export async function getMyBids(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Bid>> {
  return httpClient.get<PaginatedResponse<Bid>>("/bids/my", {
    params: { page, limit },
  });
}

/** PATCH /bids/:bidId/withdraw — retrage o ofertă plasată */
export async function withdrawBid(bidId: number): Promise<Bid> {
  return httpClient.patch<Bid>(`/bids/${bidId}/withdraw`);
}

/** DELETE /bids/:bidId — șterge definitiv o ofertă respinsă/retrasă/expirată */
export async function deleteBid(bidId: number): Promise<void> {
  return httpClient.delete<void>(`/bids/${bidId}`);
}

// ─── Seller endpoints ─────────────────────────────────────────────────────────

/** GET /bids/vehicle/:vehicleId — toate ofertele pentru un vehicul (seller) */
export async function getVehicleBids(vehicleId: number): Promise<Bid[]> {
  return httpClient.get<Bid[]>(`/bids/vehicle/${vehicleId}`);
}

/** PATCH /bids/:bidId/accept — acceptă o ofertă */
export async function acceptBid(bidId: number): Promise<Bid> {
  return httpClient.patch<Bid>(`/bids/${bidId}/accept`);
}

/** PATCH /bids/:bidId/reject — respinge o ofertă cu motiv opțional */
export async function rejectBid(bidId: number, reason?: string): Promise<Bid> {
  return httpClient.patch<Bid>(`/bids/${bidId}/reject`, { reason });
}

/** GET /bids/received — toate bid-urile primite pe vehiculele seller-ului */
export async function getReceivedBids(
  page = 1,
  limit = 20,
  status?: BidStatus,
): Promise<PaginatedResponse<Bid>> {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  return httpClient.get<PaginatedResponse<Bid>>("/bids/received", { params });
}
