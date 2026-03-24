import type {
  BidStatusFilter,
  BidSortOption,
  MyBidsTab,
} from "~/interface/bid.interface";

// ─── Page Tabs ────────────────────────────────────────────────────────────────

export const BIDS_PAGE_TABS: { key: MyBidsTab; label: string }[] = [
  { key: "placed", label: "Placed Bids" },
  { key: "received", label: "Received Bids" },
];

// ─── Status Filter Tabs ───────────────────────────────────────────────────────

export const BID_STATUS_TABS: { key: BidStatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "expired", label: "Expired" },
  { key: "withdrawn", label: "Withdrawn" },
];

// ─── Sort Options ─────────────────────────────────────────────────────────────

export const BID_SORT_OPTIONS: { key: BidSortOption; label: string }[] = [
  { key: "newest", label: "Newest First" },
  { key: "oldest", label: "Oldest First" },
  { key: "amount-high", label: "Amount: High → Low" },
  { key: "amount-low", label: "Amount: Low → High" },
];

// ─── Pagination ───────────────────────────────────────────────────────────────

export const BIDS_PER_PAGE = 10;
