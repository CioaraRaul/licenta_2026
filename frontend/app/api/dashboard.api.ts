import { httpClient } from './http.api';
import type { SellerStats, BuyerStats } from '~/interface/dashboard.interface';

/**
 * GET /dashboard/stats
 * Returnează statistici în funcție de rolul utilizatorului curent.
 * Dacă e seller → SellerStats; dacă e buyer → BuyerStats.
 */
export async function getDashboardStats(): Promise<SellerStats | BuyerStats> {
  return httpClient.get<SellerStats | BuyerStats>('/dashboard/stats');
}

/** GET /dashboard/stats/seller — statistici detaliate seller */
export async function getSellerStats(): Promise<SellerStats> {
  return httpClient.get<SellerStats>('/dashboard/stats/seller');
}

/** GET /dashboard/stats/buyer — statistici detaliate buyer */
export async function getBuyerStats(): Promise<BuyerStats> {
  return httpClient.get<BuyerStats>('/dashboard/stats/buyer');
}
