import { VEHICLES_PER_PAGE } from "~/constants/findVehicle.constants";
import type {
  FilterVehicleParams,
  Vehicle,
} from "~/interface/vehicle.interface";
import { formatMileage } from "./format.utils";
import { getFuelTypeLabel, getTransmissionLabel } from "./vehicle.utils";

// ─── URL ↔ Filter conversion ─────────────────────────────────────────────────

/** Read URLSearchParams and return a typed FilterVehicleParams object. */
export function paramsToFilters(sp: URLSearchParams): FilterVehicleParams {
  const get = (k: string) => sp.get(k) || undefined;
  const getNum = (k: string) => {
    const v = sp.get(k);
    return v ? Number(v) : undefined;
  };

  return {
    search: get("search"),
    make: get("make"),
    model: get("model"),
    type: get("type") as FilterVehicleParams["type"],
    condition: get("condition") as FilterVehicleParams["condition"],
    fuelType: get("fuelType") as FilterVehicleParams["fuelType"],
    transmission: get("transmission") as FilterVehicleParams["transmission"],
    exteriorColor: get("exteriorColor"),
    city: get("city"),
    country: get("country"),
    yearFrom: getNum("yearFrom"),
    yearTo: getNum("yearTo"),
    priceFrom: getNum("priceFrom"),
    priceTo: getNum("priceTo"),
    mileageFrom: getNum("mileageFrom"),
    mileageTo: getNum("mileageTo"),
    page: getNum("page") ?? 1,
    limit: VEHICLES_PER_PAGE,
    sortBy: (get("sortBy") as FilterVehicleParams["sortBy"]) ?? "createdAt",
    sortOrder: (get("sortOrder") as FilterVehicleParams["sortOrder"]) ?? "DESC",
  };
}

/** Convert FilterVehicleParams → URL query params, omitting defaults. */
export function filtersToParams(
  filters: FilterVehicleParams,
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "" || key === "limit") continue;
    if (key === "page" && value === 1) continue;
    if (key === "sortBy" && value === "createdAt") continue;
    if (key === "sortOrder" && value === "DESC") continue;
    out[key] = String(value);
  }

  return out;
}

// ─── Active filter helpers ────────────────────────────────────────────────────

/** Keys that are meta, not user-facing filters. */
const META_KEYS = new Set(["page", "limit", "sortBy", "sortOrder"]);

/** Count how many user-applied filters are active (excludes pagination/sort). */
export function countActiveFilters(filters: FilterVehicleParams): number {
  return Object.entries(filters).filter(
    ([key, value]) =>
      value !== undefined && value !== "" && !META_KEYS.has(key),
  ).length;
}

/** Return active filter entries (key-value pairs), excluding meta keys. */
export function getActiveFilterEntries(
  filters: FilterVehicleParams,
): [string, unknown][] {
  return Object.entries(filters).filter(
    ([key, value]) =>
      value !== undefined && value !== "" && !META_KEYS.has(key),
  );
}

// ─── Display formatting ──────────────────────────────────────────────────────

/** Human-readable display value for a single filter chip. */
export function formatFilterValue(key: string, value: unknown): string {
  const v = String(value);

  if ((key === "priceFrom" || key === "priceTo") && !isNaN(Number(v))) {
    return `$${Number(v).toLocaleString()}`;
  }

  if ((key === "mileageFrom" || key === "mileageTo") && !isNaN(Number(v))) {
    return `${Number(v).toLocaleString()} mi`;
  }

  // Capitalise and replace underscores (e.g. "certified_pre_owned" → "Certified Pre Owned")
  return v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Pagination ──────────────────────────────────────────────────────────────

/** Build the page-number array with ellipsis markers for the pagination bar. */
export function getPageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

// ─── Vehicle specs (for QuickViewModal) ──────────────────────────────────────

export interface VehicleSpec {
  label: string;
  value: string;
}

/** Build the specs grid data for a vehicle detail / quick-view. */
export function buildVehicleSpecs(vehicle: Vehicle): VehicleSpec[] {
  return [
    { label: "Year", value: String(vehicle.year) },
    { label: "Mileage", value: formatMileage(vehicle.mileage) },
    { label: "Fuel", value: getFuelTypeLabel(vehicle.fuelType) },
    {
      label: "Transmission",
      value: getTransmissionLabel(vehicle.transmission),
    },
    { label: "Drivetrain", value: vehicle.driveType.toUpperCase() },
    { label: "Engine", value: `${vehicle.engineSize}L` },
    ...(vehicle.horsepower
      ? [{ label: "Power", value: `${vehicle.horsepower} HP` }]
      : []),
    { label: "Doors", value: String(vehicle.doors) },
    { label: "Seats", value: String(vehicle.seats) },
    { label: "Exterior", value: vehicle.exteriorColor },
    ...(vehicle.interiorColor
      ? [{ label: "Interior", value: vehicle.interiorColor }]
      : []),
    { label: "Condition", value: vehicle.condition.replace(/_/g, " ") },
  ];
}
