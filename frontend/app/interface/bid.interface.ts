import type { User } from './user.interface';
import type { Vehicle } from './vehicle.interface';

// ─── Enum ─────────────────────────────────────────────────────────────────────

export type BidStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'expired';

// ─── Bid entity ───────────────────────────────────────────────────────────────

export interface Bid {
  id: number;
  amount: number;
  status: BidStatus;
  message?: string;
  rejectionReason?: string;

  buyer: User;
  buyerId: number;

  vehicle: Vehicle;
  vehicleId: number;

  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateBidPayload {
  amount: number;
  message?: string;
}
