import type {
  ListingStatusFilter,
  ListingSortOption,
} from "~/interface/vehicle.interface";

// ─── Status Filter Tabs ───────────────────────────────────────────────────────

export const STATUS_TABS: { key: ListingStatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "sold", label: "Sold" },
  { key: "inactive", label: "Inactive" },
];

// ─── Sort Options ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS: { key: ListingSortOption; label: string }[] = [
  { key: "newest", label: "Newest First" },
  { key: "oldest", label: "Oldest First" },
  { key: "price-high", label: "Price: High → Low" },
  { key: "price-low", label: "Price: Low → High" },
  { key: "most-views", label: "Most Views" },
];

// ─── Pagination ───────────────────────────────────────────────────────────────

export const ITEMS_PER_PAGE = 10;
