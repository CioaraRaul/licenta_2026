import type { Vehicle } from "~/interface/vehicle.interface";
import type { HighlightMode } from "~/interface/compare-spec.interface";
import type {
  SimilarityResult,
  SimilarityItem,
} from "~/interface/compare-similarity.interface";
import { formatCurrencyFull, formatMileage } from "~/utils/format.utils";
import { getFuelTypeLabel, getTransmissionLabel } from "~/utils/vehicle.utils";

// ─── Display helpers ──────────────────────────────────────────────────────────

/** Build vehicle title string */
export function getVehicleTitle(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

/** Get drive type display label */
export function getDriveTypeLabel(driveType: string): string {
  const labels: Record<string, string> = {
    fwd: "FWD",
    rwd: "RWD",
    awd: "AWD",
    "4wd": "4WD",
  };
  return labels[driveType] ?? driveType;
}

/** Get vehicle condition display label */
export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new: "New",
    used: "Used",
    certified_pre_owned: "Certified Pre-Owned",
  };
  return labels[condition] ?? condition;
}

/** Get vehicle type display label */
export function getVehicleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    car: "Car",
    suv: "SUV",
    truck: "Truck",
    van: "Van",
    motorcycle: "Motorcycle",
    sports_car: "Sports Car",
  };
  return labels[type] ?? type;
}

// ─── Compare-specific helpers ─────────────────────────────────────────────────

/** Extract numeric value from a vehicle for comparison */
export function getNumericValue(
  vehicle: Vehicle,
  key: keyof Vehicle,
): number | null {
  const val = vehicle[key];
  if (typeof val === "number") return val;
  return null;
}

/**
 * Given a list of vehicles and a numeric key, find the "winner" index.
 * Returns the index of the vehicle with the best value, or -1 if none.
 *
 * Supports all HighlightMode strategies:
 *  - lowest / highest          → numeric comparison
 *  - boolean_prefer_true/false → boolean comparison
 *  - enum_rank                 → map values to numeric ranks, pick highest
 *  - count                     → compare array .length via countKey
 */
export function findWinnerIndex(
  vehicles: Vehicle[],
  key: keyof Vehicle,
  mode: HighlightMode,
  rankMap?: Record<string, number>,
  countKey?: keyof Vehicle,
): number {
  if (vehicles.length < 2) return -1;

  // ── boolean modes ─────────────────────────────────────────────────────────
  if (mode === "boolean_prefer_true" || mode === "boolean_prefer_false") {
    const preferred = mode === "boolean_prefer_true";
    const values = vehicles.map((v) => {
      const val = v[key];
      return typeof val === "boolean" ? val : null;
    });
    const validValues = values.filter((v): v is boolean => v !== null);
    if (validValues.length < 2 || new Set(validValues).size <= 1) return -1;
    return values.findIndex((v) => v === preferred);
  }

  // ── enum_rank mode ────────────────────────────────────────────────────────
  if (mode === "enum_rank" && rankMap) {
    const ranks = vehicles.map((v) => {
      const val = v[key];
      return typeof val === "string" ? (rankMap[val] ?? -1) : -1;
    });
    const validRanks = ranks.filter((r) => r >= 0);
    if (validRanks.length < 2 || new Set(validRanks).size <= 1) return -1;
    let bestIdx = -1;
    let bestRank = -1;
    ranks.forEach((r, i) => {
      if (r > bestRank) {
        bestRank = r;
        bestIdx = i;
      }
    });
    return bestIdx;
  }

  // ── count mode (array lengths) ────────────────────────────────────────────
  if (mode === "count") {
    const arrKey = countKey ?? key;
    const lengths = vehicles.map((v) => {
      const arr = v[arrKey];
      return Array.isArray(arr) ? arr.length : 0;
    });
    if (new Set(lengths).size <= 1) return -1;
    let bestIdx = 0;
    lengths.forEach((len, i) => {
      if (len > lengths[bestIdx]) bestIdx = i;
    });
    return bestIdx;
  }

  // ── numeric lowest / highest ──────────────────────────────────────────────
  let bestIndex = -1;
  let bestValue: number | null = null;

  vehicles.forEach((v, i) => {
    const val = getNumericValue(v, key);
    if (val === null) return;

    if (bestValue === null) {
      bestValue = val;
      bestIndex = i;
      return;
    }

    if (mode === "lowest" && val < bestValue) {
      bestValue = val;
      bestIndex = i;
    } else if (mode === "highest" && val > bestValue) {
      bestValue = val;
      bestIndex = i;
    }
  });

  // Only return winner if there's actually a difference
  const values = vehicles
    .map((v) => getNumericValue(v, key))
    .filter((v): v is number => v !== null);
  const allSame = new Set(values).size <= 1;
  return allSame ? -1 : bestIndex;
}

/**
 * Get the spec value for display, falls back to "—" for missing data
 */
export function getSpecDisplayValue(vehicle: Vehicle, key: string): string {
  switch (key) {
    case "price":
      return formatCurrencyFull(vehicle.price);
    case "originalPrice":
      return vehicle.originalPrice
        ? formatCurrencyFull(vehicle.originalPrice)
        : "—";
    case "mileage":
      return formatMileage(vehicle.mileage);
    case "fuelType":
      return getFuelTypeLabel(vehicle.fuelType);
    case "transmission":
      return getTransmissionLabel(vehicle.transmission);
    case "driveType":
      return getDriveTypeLabel(vehicle.driveType);
    case "condition":
      return getConditionLabel(vehicle.condition);
    case "type":
      return getVehicleTypeLabel(vehicle.type);
    case "engineSize":
      return vehicle.engineSize ? `${vehicle.engineSize}L` : "—";
    case "horsepower":
      return vehicle.horsepower ? `${vehicle.horsepower} hp` : "—";
    case "torque":
      return vehicle.torque ? `${vehicle.torque} lb-ft` : "—";
    case "doors":
      return `${vehicle.doors}`;
    case "seats":
      return `${vehicle.seats}`;
    case "exteriorColor":
      return vehicle.exteriorColor || "—";
    case "interiorColor":
      return vehicle.interiorColor || "—";
    case "previousOwners":
      return `${vehicle.previousOwners}`;
    case "accidentHistory":
      return vehicle.accidentHistory ? "Yes" : "No";
    case "warrantyAvailable":
      return vehicle.warrantyAvailable ? "Yes" : "No";
    case "location":
      return `${vehicle.city}, ${vehicle.country}`;
    case "vin":
      return vehicle.vin || "—";
    case "negotiable":
      return vehicle.negotiable ? "Yes" : "No";
    default: {
      const val = (vehicle as unknown as Record<string, unknown>)[key];
      if (val === undefined || val === null || val === "") return "—";
      return String(val);
    }
  }
}

/**
 * Calculate similarity percentage between two vehicles based on shared attributes.
 */
export function calculateSimilarity(a: Vehicle, b: Vehicle): number {
  return calculateDetailedSimilarity(a, b).overall;
}

/**
 * Calculate detailed similarity between two vehicles.
 * Returns overall percentage AND per-attribute match/differ breakdown.
 */
export function calculateDetailedSimilarity(
  a: Vehicle,
  b: Vehicle,
): SimilarityResult {
  const items: SimilarityItem[] = [
    // ── Identity ──────────────────────────────────────────────────────────
    {
      label: "Make",
      category: "Identity",
      matches: a.make?.toLowerCase() === b.make?.toLowerCase(),
    },
    {
      label: "Model",
      category: "Identity",
      matches: a.model?.toLowerCase() === b.model?.toLowerCase(),
    },
    {
      label: "Type",
      category: "Identity",
      matches: a.type === b.type,
    },
    {
      label: "Condition",
      category: "Identity",
      matches: a.condition === b.condition,
    },
    {
      label: "Year",
      category: "Identity",
      matches: Math.abs(a.year - b.year) <= 2,
    },

    // ── Performance ───────────────────────────────────────────────────────
    {
      label: "Fuel Type",
      category: "Performance",
      matches: a.fuelType === b.fuelType,
    },
    {
      label: "Transmission",
      category: "Performance",
      matches: a.transmission === b.transmission,
    },
    {
      label: "Drive Type",
      category: "Performance",
      matches: a.driveType === b.driveType,
    },
    {
      label: "Engine Size",
      category: "Performance",
      matches:
        !!a.engineSize &&
        !!b.engineSize &&
        Math.abs(a.engineSize - b.engineSize) <= 0.5,
    },

    // ── Pricing ───────────────────────────────────────────────────────────
    {
      label: "Price Range",
      category: "Pricing",
      matches:
        Math.abs(a.price - b.price) / Math.max(a.price, b.price, 1) < 0.2,
    },
    {
      label: "Negotiable",
      category: "Pricing",
      matches: a.negotiable === b.negotiable,
    },

    // ── Comfort ───────────────────────────────────────────────────────────
    {
      label: "Doors",
      category: "Comfort",
      matches: a.doors === b.doors,
    },
    {
      label: "Seats",
      category: "Comfort",
      matches: a.seats === b.seats,
    },

    // ── Mileage ───────────────────────────────────────────────────────────
    {
      label: "Mileage",
      category: "Usage",
      matches:
        Math.abs(a.mileage - b.mileage) / Math.max(a.mileage, b.mileage, 1) <
        0.3,
    },

    // ── Location ──────────────────────────────────────────────────────────
    {
      label: "City",
      category: "Location",
      matches:
        !!a.city && !!b.city && a.city.toLowerCase() === b.city.toLowerCase(),
    },
    {
      label: "Country",
      category: "Location",
      matches:
        !!a.country &&
        !!b.country &&
        a.country.toLowerCase() === b.country.toLowerCase(),
    },
  ];

  const matchCount = items.filter((i) => i.matches).length;
  const overall = Math.round((matchCount / items.length) * 100);

  return { overall, items };
}
