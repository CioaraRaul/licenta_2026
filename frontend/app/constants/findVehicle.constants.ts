// ─── Find Vehicle page constants ──────────────────────────────────────────────

export const VEHICLES_PER_PAGE = 12;

export const VEHICLE_TYPE_OPTIONS = [
  { value: "car", label: "Car" },
  { value: "suv", label: "SUV" },
  { value: "truck", label: "Truck" },
  { value: "van", label: "Van" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "sports_car", label: "Sports Car" },
] as const;

export const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified_pre_owned", label: "Certified Pre-Owned" },
] as const;

export const FUEL_TYPE_OPTIONS = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "plugin_hybrid", label: "Plug-in Hybrid" },
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "semi_automatic", label: "Semi-Auto" },
] as const;

export const EXTERIOR_COLOR_OPTIONS = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "silver", label: "Silver" },
  { value: "gray", label: "Gray" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "brown", label: "Brown" },
  { value: "beige", label: "Beige" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
] as const;

export const SORT_OPTIONS = [
  { value: "createdAt-DESC", label: "Newest First" },
  { value: "createdAt-ASC", label: "Oldest First" },
  { value: "price-ASC", label: "Price: Low → High" },
  { value: "price-DESC", label: "Price: High → Low" },
  { value: "year-DESC", label: "Year: Newest" },
  { value: "year-ASC", label: "Year: Oldest" },
  { value: "mileage-ASC", label: "Mileage: Low → High" },
  { value: "mileage-DESC", label: "Mileage: High → Low" },
] as const;

export const PRICE_PRESETS = [
  { label: "Under $10k", from: undefined, to: 10_000 },
  { label: "$10k – $25k", from: 10_000, to: 25_000 },
  { label: "$25k – $50k", from: 25_000, to: 50_000 },
  { label: "$50k – $100k", from: 50_000, to: 100_000 },
  { label: "$100k+", from: 100_000, to: undefined },
] as const;

/** Human-readable label for each filter key (used in active filter chips) */
export const FILTER_LABELS: Record<string, string> = {
  search: "Search",
  make: "Make",
  model: "Model",
  type: "Type",
  condition: "Condition",
  fuelType: "Fuel",
  transmission: "Transmission",
  exteriorColor: "Color",
  city: "City",
  country: "Country",
  yearFrom: "Year from",
  yearTo: "Year to",
  priceFrom: "Price from",
  priceTo: "Price to",
  mileageFrom: "Miles from",
  mileageTo: "Miles to",
};
