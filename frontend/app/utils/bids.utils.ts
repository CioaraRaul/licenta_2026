import type {
  Bid,
  BidStatusFilter,
  BidSortOption,
  BidStats,
  BidStatus,
} from "~/interface/bid.interface";
import type { Vehicle } from "~/interface/vehicle.interface";

// ─── Stats ────────────────────────────────────────────────────────────────────

export function computeBidStats(bids: Bid[]): BidStats {
  return bids.reduce<BidStats>(
    (acc, b) => {
      acc.total++;
      if (b.status === "pending") acc.pending++;
      else if (b.status === "accepted") acc.accepted++;
      else if (b.status === "rejected") acc.rejected++;
      else if (b.status === "expired") acc.expired++;
      else if (b.status === "withdrawn") acc.withdrawn++;
      return acc;
    },
    {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
      withdrawn: 0,
    },
  );
}

// ─── Filtering ────────────────────────────────────────────────────────────────

export function filterBidsByStatus(
  bids: Bid[],
  status: BidStatusFilter,
): Bid[] {
  if (status === "all") return bids;
  return bids.filter((b) => b.status === status);
}

export function searchBids(bids: Bid[], query: string): Bid[] {
  if (!query.trim()) return bids;
  const q = query.toLowerCase().trim();
  return bids.filter((b) => {
    const v = b.vehicle;
    const buyerName = b.buyer
      ? `${b.buyer.firstName ?? ""} ${b.buyer.lastName ?? ""} ${b.buyer.username ?? ""}`.toLowerCase()
      : "";
    const vehicleTitle = v
      ? `${v.year} ${v.make} ${v.model}`.toLowerCase()
      : "";
    return (
      vehicleTitle.includes(q) ||
      buyerName.includes(q) ||
      `${b.amount}`.includes(q)
    );
  });
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

export function sortBids(bids: Bid[], sortBy: BidSortOption): Bid[] {
  const sorted = [...bids];
  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case "amount-high":
      return sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
    case "amount-low":
      return sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
    default:
      return sorted;
  }
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export function getBidVehicleTitle(v: Vehicle | undefined): string {
  if (!v) return "Unknown Vehicle";
  return `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ""}`;
}

export function getBidVehicleThumbnail(v: Vehicle | undefined): string | null {
  return v?.images?.[0] ?? null;
}

export function getBidStatusBadge(status: BidStatus): {
  label: string;
  cls: string;
} {
  switch (status) {
    case "pending":
      return { label: "Pending", cls: "bg-[#f59e0b]/15 text-[#f59e0b]" };
    case "accepted":
      return { label: "Accepted", cls: "bg-[#10b981]/15 text-[#10b981]" };
    case "rejected":
      return { label: "Rejected", cls: "bg-[#f87171]/15 text-[#f87171]" };
    case "expired":
      return { label: "Expired", cls: "bg-[#8e8e9a]/15 text-[#8e8e9a]" };
    case "withdrawn":
      return { label: "Withdrawn", cls: "bg-[#8b5cf6]/15 text-[#8b5cf6]" };
    default:
      return { label: status, cls: "bg-white/10 text-white" };
  }
}
