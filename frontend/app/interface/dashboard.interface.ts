// ─── Seller stats (GET /dashboard/stats/seller) ────────────────────────────────

import type { SavedVehicle } from "./saved-vehicle.interface";
import type { User } from "./user.interface";
import type { Vehicle } from "./vehicle.interface";

export interface SellerStats {
  listings: {
    total: number;
    active: number;
    sold: number;
    pending: number;
  };
  bids: {
    total: number;
    pending: number;
  };
  views: {
    total: number;
  };
  revenue: {
    total: number;
  };
}

// ─── Buyer stats (GET /dashboard/stats/buyer) ──────────────────────────────────

export interface BuyerStats {
  bids: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  saved: {
    total: number;
  };
  spent: {
    total: number;
  };
}

export interface DashboardMainProps {
  stats: SellerStats | BuyerStats | null;
  isSeller: boolean;
  user: User | null;
  listings: Vehicle[];
  savedVehicles: SavedVehicle[];
  error: boolean;
}
