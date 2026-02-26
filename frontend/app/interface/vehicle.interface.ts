import type { User } from "./user.interface";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type VehicleType =
  | "car"
  | "suv"
  | "truck"
  | "van"
  | "motorcycle"
  | "sports_car";

export type VehicleCondition = "new" | "used" | "certified_pre_owned";

export type VehicleStatus = "available" | "pending" | "sold" | "reserved";

export type FuelType =
  | "gasoline"
  | "diesel"
  | "electric"
  | "hybrid"
  | "plugin_hybrid";

export type Transmission = "manual" | "automatic" | "semi_automatic";

export type DriveType = "fwd" | "rwd" | "awd" | "4wd";

export type VehicleSortBy = "price" | "year" | "mileage" | "createdAt";

// ─── Vehicle entity ───────────────────────────────────────────────────────────

export interface Vehicle {
  id: number;

  // Basic info
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  condition: VehicleCondition;
  trim?: string;

  // Pricing
  price: number;
  originalPrice?: number;
  negotiable: boolean;

  // Mileage & location
  mileage: number;
  city: string;
  country: string;
  zipCode?: string;

  // Engine & performance
  engineSize: number;
  engineType?: string;
  horsepower?: number;
  torque?: number;
  fuelType: FuelType;
  transmission: Transmission;
  driveType: DriveType;

  // Exterior
  exteriorColor: string;
  interiorColor?: string;
  doors: number;
  seats: number;

  // VIN & registration
  vin: string;
  licensePlate?: string;
  registrationNumber?: string;

  // Features
  features?: string[];
  safetyFeatures?: string[];

  // Description & media
  description: string;
  images: string[];
  videoUrl?: string;

  // History & documentation
  previousOwners: number;
  accidentHistory: boolean;
  serviceHistory?: string;
  warrantyAvailable: boolean;
  warrantyExpiryDate?: string;

  // Status & visibility
  status: VehicleStatus;
  isActive: boolean;
  isFeatured: boolean;

  // Seller
  sellerId: number;
  seller: User;

  // Analytics
  viewsCount: number;
  savesCount: number;
  contactsCount: number;

  createdAt: string;
  updatedAt: string;
}

// ─── Create / Update payloads ─────────────────────────────────────────────────

export interface CreateVehiclePayload {
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  condition: VehicleCondition;
  trim?: string;

  price: number;
  originalPrice?: number;
  negotiable?: boolean;

  mileage: number;
  city: string;
  country: string;
  zipCode?: string;

  engineSize: number;
  engineType?: string;
  horsepower?: number;
  torque?: number;
  fuelType: FuelType;
  transmission: Transmission;
  driveType: DriveType;

  exteriorColor: string;
  interiorColor?: string;
  doors?: number;
  seats?: number;

  vin: string;
  licensePlate?: string;
  registrationNumber?: string;

  features?: string[];
  safetyFeatures?: string[];

  description: string;
  images: string[];
  videoUrl?: string;

  previousOwners?: number;
  accidentHistory?: boolean;
  serviceHistory?: string;
  warrantyAvailable?: boolean;
  warrantyExpiryDate?: string;

  isFeatured?: boolean;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

// ─── Filter params (GET /vehicles query string) ────────────────────────────────

export interface FilterVehicleParams {
  search?: string;
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  type?: VehicleType;
  condition?: VehicleCondition;
  priceFrom?: number;
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  city?: string;
  country?: string;
  fuelType?: FuelType;
  transmission?: Transmission;
  exteriorColor?: string;

  page?: number;
  limit?: number;
  sortBy?: VehicleSortBy;
  sortOrder?: "ASC" | "DESC";
}

// ─── Generic paginated response (reused by all list endpoints) ─────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Backend response shape for GET /vehicles/my/listings ──────────────────────

export interface MyListingsApiResponse {
  vehicles: Vehicle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── My Listings page ──────────────────────────────────────────────────────────

/** All statuses the user can filter by in the My Listings view */
export type ListingStatusFilter =
  | "all"
  | "active"
  | "pending"
  | "sold"
  | "inactive";

/** Sort options available in the My Listings view */
export type ListingSortOption =
  | "newest"
  | "oldest"
  | "price-high"
  | "price-low"
  | "most-views";

/** Summary counters shown above the listings table */
export interface ListingStats {
  total: number;
  active: number;
  pending: number;
  sold: number;
  inactive: number;
}

/** Props passed from the route's clientLoader to the MyListings component */
export interface MyListingsPageData {
  vehicles: Vehicle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error: boolean;
}

// ─── Sub-component props ──────────────────────────────────────────────────────

/** Props for a single listing row in the table */
export interface ListingRowProps {
  vehicle: Vehicle;
  isLoading: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
  onMarkSold: () => void;
  onDelete: () => void;
}

/** Props for the contextual action dropdown menu */
export interface ActionMenuProps {
  vehicle: Vehicle;
  onDeactivate: () => void;
  onReactivate: () => void;
  onMarkSold: () => void;
  onDelete: () => void;
}
