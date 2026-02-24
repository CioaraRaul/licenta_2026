// ─── Seller stats (GET /dashboard/stats/seller) ────────────────────────────────

export interface SellerStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalBids: number;
  pendingBids: number;
  totalEarnings: number;
  pendingBalance: number;
  totalCarsSold: number;
  sellerRating: number;
  totalReviews: number;
}

// ─── Buyer stats (GET /dashboard/stats/buyer) ──────────────────────────────────

export interface BuyerStats {
  totalBids: number;
  activeBids: number;
  acceptedBids: number;
  savedVehicles: number;
  walletBalance: number;
  totalSpent: number;
}
