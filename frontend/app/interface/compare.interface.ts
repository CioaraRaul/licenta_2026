import type { Vehicle } from "./vehicle.interface";

// ─── Compare spec row ─────────────────────────────────────────────────────────

/** A single row in the comparison table */
export interface CompareSpecRow {
  label: string;
  key: string;
  getValue: (vehicle: Vehicle) => string;
  /** If set, highlight the "best" value across the compared vehicles */
  highlight?: "lowest" | "highest";
}

/** Grouped spec rows for category-based rendering */
export interface CompareSpecGroup {
  title: string;
  icon: React.ReactNode;
  rows: CompareSpecRow[];
}

// ─── Compare store ────────────────────────────────────────────────────────────

export interface CompareState {
  /** Vehicle IDs currently selected for comparison */
  vehicleIds: number[];
  /** Resolved vehicle objects (fetched lazily) */
  vehicles: Vehicle[];
  /** Loading flag while fetching vehicles */
  isLoading: boolean;
  /** Error message if fetch fails */
  error: string | null;

  addVehicle: (id: number) => void;
  removeVehicle: (id: number) => void;
  clearAll: () => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hasVehicle: (id: number) => boolean;
}

// ─── Compare page props ───────────────────────────────────────────────────────

export interface ComparePageData {
  vehicles: Vehicle[];
  error: boolean;
}

export interface CompareComponentProps {
  vehicles: Vehicle[];
  error: boolean;
}

// ─── Sub-component props ──────────────────────────────────────────────────────

export interface CompareHeaderProps {
  vehicleCount: number;
  maxVehicles: number;
  onClearAll: () => void;
}

export interface CompareCardProps {
  vehicle: Vehicle;
  onRemove: (id: number) => void;
}

export interface CompareEmptySlotProps {
  onAddVehicle: () => void;
}

export interface CompareTableProps {
  vehicles: Vehicle[];
  groups: CompareSpecGroup[];
}

export interface CompareSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (vehicle: Vehicle) => void;
  excludeIds: number[];
}

export interface CompareWinnerBadgeProps {
  isWinner: boolean;
}
