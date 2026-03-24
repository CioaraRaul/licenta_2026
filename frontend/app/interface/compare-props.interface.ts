import type { Vehicle } from "./vehicle.interface";
import type { CompareSpecGroup } from "./compare-spec.interface";

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
