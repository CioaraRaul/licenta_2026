import type { CreateVehiclePayload } from "~/interface/vehicle.interface";

// ─── Form Steps ───────────────────────────────────────────────────────────────

export const STEPS = [
  { key: "basics", label: "Basic Info" },
  { key: "details", label: "Details" },
  { key: "features", label: "Features" },
  { key: "media", label: "Photos" },
  { key: "pricing", label: "Pricing" },
] as const;

// ─── Drive-Type Options ───────────────────────────────────────────────────────

export const DRIVE_TYPE_OPTIONS = [
  { value: "fwd", label: "FWD" },
  { value: "rwd", label: "RWD" },
  { value: "awd", label: "AWD" },
  { value: "4wd", label: "4WD" },
] as const;

// ─── Common Features ──────────────────────────────────────────────────────────

export const COMMON_FEATURES = [
  "Air Conditioning",
  "Bluetooth",
  "Cruise Control",
  "Navigation System",
  "Backup Camera",
  "Keyless Entry",
  "Heated Seats",
  "Leather Seats",
  "Sunroof",
  "Apple CarPlay",
  "Android Auto",
  "USB Ports",
  "Parking Sensors",
  "Power Windows",
  "Power Mirrors",
  "Alloy Wheels",
  "LED Headlights",
  "Fog Lights",
  "Roof Rails",
  "Tow Package",
] as const;

// ─── Common Safety Features ───────────────────────────────────────────────────

export const COMMON_SAFETY_FEATURES = [
  "ABS",
  "Airbags",
  "Blind Spot Monitor",
  "Lane Departure Warning",
  "Forward Collision Warning",
  "Adaptive Cruise Control",
  "Traction Control",
  "Stability Control",
  "Tire Pressure Monitor",
  "Rear Cross Traffic Alert",
  "Emergency Braking",
  "Child Safety Locks",
] as const;

// ─── Image Limits ─────────────────────────────────────────────────────────────

export const MAX_IMAGES = 20;

// ─── Default Form State ───────────────────────────────────────────────────────

export type NewListingForm = {
  make: string;
  model: string;
  year: number;
  type: CreateVehiclePayload["type"];
  condition: CreateVehiclePayload["condition"];
  trim: string;
  engineSize: number;
  engineType: string;
  horsepower: number;
  torque: number;
  fuelType: CreateVehiclePayload["fuelType"];
  transmission: CreateVehiclePayload["transmission"];
  driveType: CreateVehiclePayload["driveType"];
  exteriorColor: string;
  interiorColor: string;
  doors: number;
  seats: number;
  city: string;
  country: string;
  zipCode: string;
  vin: string;
  licensePlate: string;
  mileage: number;
  previousOwners: number;
  accidentHistory: boolean;
  serviceHistory: string;
  warrantyAvailable: boolean;
  description: string;
  price: number;
  originalPrice: number;
  negotiable: boolean;
};

export const DEFAULT_FORM: NewListingForm = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  type: "car",
  condition: "used",
  trim: "",
  engineSize: 0,
  engineType: "",
  horsepower: 0,
  torque: 0,
  fuelType: "gasoline",
  transmission: "automatic",
  driveType: "fwd",
  exteriorColor: "black",
  interiorColor: "",
  doors: 4,
  seats: 5,
  city: "",
  country: "",
  zipCode: "",
  vin: "",
  licensePlate: "",
  mileage: 0,
  previousOwners: 0,
  accidentHistory: false,
  serviceHistory: "",
  warrantyAvailable: false,
  description: "",
  price: 0,
  originalPrice: 0,
  negotiable: true,
};

// TODO: Remove after testing — pre-filled form for quick dev testing
export const DEV_FORM: NewListingForm = {
  make: "BMW",
  model: "M3 Competition",
  year: 2023,
  type: "sports_car",
  condition: "used",
  trim: "Competition xDrive",
  engineSize: 3.0,
  engineType: "Inline-6 Twin-Turbo",
  horsepower: 503,
  torque: 479,
  fuelType: "gasoline",
  transmission: "automatic",
  driveType: "awd",
  exteriorColor: "black",
  interiorColor: "Red Merino leather",
  doors: 4,
  seats: 5,
  city: "Bucharest",
  country: "Romania",
  zipCode: "010101",
  vin: "WBS43AZ09P1234567",
  licensePlate: "B-123-ABC",
  mileage: 12500,
  previousOwners: 1,
  accidentHistory: false,
  serviceHistory: "Full BMW dealer service history",
  warrantyAvailable: true,
  description:
    "2023 BMW M3 Competition xDrive in pristine condition. Only 12,500 km, full service history at authorized BMW dealer. Carbon fiber roof, M carbon bucket seats, Harman Kardon sound system. No accidents, single owner, garage kept.",
  price: 72500,
  originalPrice: 85000,
  negotiable: true,
};
