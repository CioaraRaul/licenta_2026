import type {
  Vehicle,
  ListingStatusFilter,
  ListingSortOption,
  ListingStats,
} from "~/interface/vehicle.interface";

// ─── Stats ────────────────────────────────────────────────────────────────────

/**
 * Computes summary counters from an array of vehicles.
 * Used in the stats bar above the listings table.
 */
export function computeListingStats(vehicles: Vehicle[]): ListingStats {
  return vehicles.reduce<ListingStats>(
    (acc, v) => {
      acc.total++;
      if (!v.isActive) {
        acc.inactive++;
      } else if (v.status === "sold") {
        acc.sold++;
      } else if (v.status === "pending" || v.status === "reserved") {
        acc.pending++;
      } else {
        acc.active++;
      }
      return acc;
    },
    { total: 0, active: 0, pending: 0, sold: 0, inactive: 0 },
  );
}

// ─── Filtering ────────────────────────────────────────────────────────────────

/**
 * Filters vehicles by status tab.
 * "all" returns everything; other options match the vehicle's status/isActive flags.
 */
export function filterByStatus(
  vehicles: Vehicle[],
  status: ListingStatusFilter,
): Vehicle[] {
  if (status === "all") return vehicles;
  if (status === "inactive") return vehicles.filter((v) => !v.isActive);
  if (status === "active")
    return vehicles.filter((v) => v.isActive && v.status === "available");
  if (status === "pending")
    return vehicles.filter(
      (v) => v.isActive && (v.status === "pending" || v.status === "reserved"),
    );
  if (status === "sold") return vehicles.filter((v) => v.status === "sold");
  return vehicles;
}

/**
 * Searches vehicles by make, model, or year.
 * Case-insensitive partial match.
 */
export function searchListings(vehicles: Vehicle[], query: string): Vehicle[] {
  if (!query.trim()) return vehicles;
  const q = query.toLowerCase().trim();
  return vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      `${v.year}`.includes(q) ||
      `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q),
  );
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

/** Sorts a (cloned) array of vehicles by the selected option. */
export function sortListings(
  vehicles: Vehicle[],
  sortBy: ListingSortOption,
): Vehicle[] {
  const sorted = [...vehicles];
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
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "most-views":
      return sorted.sort((a, b) => b.viewsCount - a.viewsCount);
    default:
      return sorted;
  }
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

/** Returns a human-readable "Listed X ago" label. */
export function getListingAge(createdAt: string): string {
  const ms = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days === 0) return "Listed today";
  if (days === 1) return "Listed yesterday";
  if (days < 30) return `Listed ${days}d ago`;
  const months = Math.floor(days / 30);
  return `Listed ${months}mo ago`;
}

/** Builds a display title from a vehicle's year, make, and model. */
export function getVehicleTitle(v: Vehicle): string {
  return `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ""}`;
}

/** Returns the first image URL or a placeholder. */
export function getVehicleThumbnail(v: Vehicle): string | null {
  return v.images?.[0] ?? null;
}
