import type { CompareSpecRow } from "~/interface/compare.interface";
import {
  getSpecDisplayValue,
  getDriveTypeLabel,
  getConditionLabel,
  getVehicleTypeLabel,
} from "~/utils/compare.utils";
import {
  formatCurrencyFull,
  formatMileage,
  formatRelativeTime,
} from "~/utils/format.utils";
import {
  getFuelTypeLabel,
  getTransmissionLabel,
  getVehicleStatusBadge,
} from "~/utils/vehicle.utils";

// ─── Max vehicles allowed for comparison ──────────────────────────────────────

export const MAX_COMPARE_VEHICLES = 4;

// ─── Spec rows grouped by category ───────────────────────────────────────────

export const PRICING_SPECS: CompareSpecRow[] = [
  {
    label: "Price",
    key: "price",
    getValue: (v) => formatCurrencyFull(v.price),
    highlight: "lowest",
  },
  {
    label: "Original Price",
    key: "originalPrice",
    getValue: (v) =>
      v.originalPrice ? formatCurrencyFull(v.originalPrice) : "—",
  },
  {
    label: "Negotiable",
    key: "negotiable",
    getValue: (v) => (v.negotiable ? "Yes" : "No"),
  },
];

export const PERFORMANCE_SPECS: CompareSpecRow[] = [
  {
    label: "Engine Size",
    key: "engineSize",
    getValue: (v) => (v.engineSize ? `${v.engineSize}L` : "—"),
  },
  {
    label: "Engine Type",
    key: "engineType",
    getValue: (v) => v.engineType || "—",
  },
  {
    label: "Horsepower",
    key: "horsepower",
    getValue: (v) => (v.horsepower ? `${v.horsepower} hp` : "—"),
    highlight: "highest",
  },
  {
    label: "Torque",
    key: "torque",
    getValue: (v) => (v.torque ? `${v.torque} lb-ft` : "—"),
    highlight: "highest",
  },
  {
    label: "Fuel Type",
    key: "fuelType",
    getValue: (v) => getFuelTypeLabel(v.fuelType),
  },
  {
    label: "Transmission",
    key: "transmission",
    getValue: (v) => getTransmissionLabel(v.transmission),
  },
  {
    label: "Drive Type",
    key: "driveType",
    getValue: (v) => getDriveTypeLabel(v.driveType),
  },
];

export const GENERAL_SPECS: CompareSpecRow[] = [
  {
    label: "Make",
    key: "make",
    getValue: (v) => v.make || "—",
  },
  {
    label: "Model",
    key: "model",
    getValue: (v) => v.model || "—",
  },
  {
    label: "Trim",
    key: "trim",
    getValue: (v) => v.trim || "—",
  },
  {
    label: "Year",
    key: "year",
    getValue: (v) => `${v.year}`,
    highlight: "highest",
  },
  {
    label: "Mileage",
    key: "mileage",
    getValue: (v) => formatMileage(v.mileage),
    highlight: "lowest",
  },
  {
    label: "Condition",
    key: "condition",
    getValue: (v) => getConditionLabel(v.condition),
  },
  {
    label: "Type",
    key: "type",
    getValue: (v) => getVehicleTypeLabel(v.type),
  },
  {
    label: "Status",
    key: "status",
    getValue: (v) => getVehicleStatusBadge(v.status, v.isActive).label,
  },
  {
    label: "Exterior Color",
    key: "exteriorColor",
    getValue: (v) => v.exteriorColor || "—",
  },
  {
    label: "Interior Color",
    key: "interiorColor",
    getValue: (v) => v.interiorColor || "—",
  },
  {
    label: "Doors",
    key: "doors",
    getValue: (v) => `${v.doors}`,
  },
  {
    label: "Seats",
    key: "seats",
    getValue: (v) => `${v.seats}`,
  },
  {
    label: "Description",
    key: "description",
    getValue: (v) =>
      v.description
        ? v.description.length > 80
          ? v.description.slice(0, 80) + "…"
          : v.description
        : "—",
  },
];

export const HISTORY_SPECS: CompareSpecRow[] = [
  {
    label: "Previous Owners",
    key: "previousOwners",
    getValue: (v) => `${v.previousOwners}`,
    highlight: "lowest",
  },
  {
    label: "Accident History",
    key: "accidentHistory",
    getValue: (v) => (v.accidentHistory ? "Yes" : "No"),
  },
  {
    label: "Service History",
    key: "serviceHistory",
    getValue: (v) => v.serviceHistory || "—",
  },
  {
    label: "Warranty",
    key: "warrantyAvailable",
    getValue: (v) => (v.warrantyAvailable ? "Yes" : "No"),
  },
  {
    label: "Warranty Expiry",
    key: "warrantyExpiryDate",
    getValue: (v) => v.warrantyExpiryDate ?? "—",
  },
];

export const LOCATION_SPECS: CompareSpecRow[] = [
  {
    label: "City",
    key: "city",
    getValue: (v) => v.city || "—",
  },
  {
    label: "Country",
    key: "country",
    getValue: (v) => v.country || "—",
  },
  {
    label: "Zip Code",
    key: "zipCode",
    getValue: (v) => v.zipCode || "—",
  },
  {
    label: "VIN",
    key: "vin",
    getValue: (v) => v.vin || "—",
  },
  {
    label: "License Plate",
    key: "licensePlate",
    getValue: (v) => v.licensePlate || "—",
  },
  {
    label: "Registration No.",
    key: "registrationNumber",
    getValue: (v) => v.registrationNumber || "—",
  },
];

export const FEATURES_SPECS: CompareSpecRow[] = [
  {
    label: "Features",
    key: "features",
    getValue: (v) =>
      v.features && v.features.length > 0 ? v.features.join(", ") : "—",
  },
  {
    label: "Safety Features",
    key: "safetyFeatures",
    getValue: (v) =>
      v.safetyFeatures && v.safetyFeatures.length > 0
        ? v.safetyFeatures.join(", ")
        : "—",
  },
  {
    label: "Photos",
    key: "images",
    getValue: (v) => (v.images ? `${v.images.length}` : "0"),
    highlight: "highest",
  },
  {
    label: "Video Available",
    key: "videoUrl",
    getValue: (v) => (v.videoUrl ? "Yes" : "No"),
  },
];

export const ANALYTICS_SPECS: CompareSpecRow[] = [
  {
    label: "Views",
    key: "viewsCount",
    getValue: (v) => v.viewsCount.toLocaleString(),
    highlight: "highest",
  },
  {
    label: "Saves",
    key: "savesCount",
    getValue: (v) => v.savesCount.toLocaleString(),
    highlight: "highest",
  },
  {
    label: "Contacts",
    key: "contactsCount",
    getValue: (v) => v.contactsCount.toLocaleString(),
    highlight: "highest",
  },
  {
    label: "Listed",
    key: "createdAt",
    getValue: (v) => formatRelativeTime(v.createdAt),
  },
  {
    label: "Seller",
    key: "seller",
    getValue: (v) =>
      v.seller
        ? `${v.seller.firstName ?? ""} ${v.seller.lastName ?? ""}`.trim() || "—"
        : "—",
  },
  {
    label: "Featured",
    key: "isFeatured",
    getValue: (v) => (v.isFeatured ? "Yes" : "No"),
  },
  {
    label: "Last Updated",
    key: "updatedAt",
    getValue: (v) => formatRelativeTime(v.updatedAt),
  },
];
