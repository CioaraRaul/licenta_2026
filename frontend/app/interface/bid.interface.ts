import type { User } from "./user.interface";
import type { Vehicle } from "./vehicle.interface";

// ─── Enum ─────────────────────────────────────────────────────────────────────

export type BidStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired";

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

// ─── Bids page ────────────────────────────────────────────────────────────────

export type MyBidsTab = "placed" | "received";

export type BidStatusFilter = BidStatus | "all";

export type BidSortOption = "newest" | "oldest" | "amount-high" | "amount-low";

export interface BidStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  withdrawn: number;
}

export interface MyBidsPageData {
  placedBids: Bid[];
  receivedBids: Bid[];
  isSeller: boolean;
  error: boolean;
}

// ─── Sub-component props ──────────────────────────────────────────────────────

export interface BidsStatsBarProps {
  stats: BidStats;
}

export interface BidsToolbarProps {
  statusFilter: BidStatusFilter;
  onStatusFilterChange: (status: BidStatusFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: BidSortOption;
  onSortChange: (sort: BidSortOption) => void;
  stats: BidStats;
}

export interface ReceivedBidRowProps {
  bid: Bid;
  isLoading: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export interface PlacedBidRowProps {
  bid: Bid;
  isLoading: boolean;
  onWithdraw: () => void;
}

export interface BidsEmptyStateProps {
  hasFilters: boolean;
  tab: MyBidsTab;
}

export interface RejectBidModalProps {
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export interface BidsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}
