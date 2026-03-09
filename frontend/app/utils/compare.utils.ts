import type { Vehicle } from "~/interface/vehicle.interface";
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
 */
export function findWinnerIndex(
  vehicles: Vehicle[],
  key: keyof Vehicle,
  mode: "lowest" | "highest",
): number {
  if (vehicles.length < 2) return -1;

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
  let matches = 0;
  let total = 0;

  const checks: Array<() => boolean> = [
    () => a.make === b.make,
    () => a.type === b.type,
    () => a.fuelType === b.fuelType,
    () => a.transmission === b.transmission,
    () => a.driveType === b.driveType,
    () => a.condition === b.condition,
    () => Math.abs(a.year - b.year) <= 2,
    () => Math.abs(a.price - b.price) / Math.max(a.price, b.price) < 0.2,
    () =>
      Math.abs(a.mileage - b.mileage) / Math.max(a.mileage, b.mileage, 1) < 0.3,
    () => a.doors === b.doors,
  ];

  checks.forEach((check) => {
    total++;
    if (check()) matches++;
  });

  return Math.round((matches / total) * 100);
}
