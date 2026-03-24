import type { Vehicle } from "./vehicle.interface";

/** Supported highlight strategies for winner detection */
export type HighlightMode =
  | "lowest"
  | "highest"
  | "boolean_prefer_true"
  | "boolean_prefer_false"
  | "enum_rank"
  | "count";

/** A single row in the comparison table */
export interface CompareSpecRow {
  label: string;
  key: string;
  getValue: (vehicle: Vehicle) => string;
  /** If set, highlight the "best" value across the compared vehicles */
  highlight?: HighlightMode;
  /** For enum_rank mode — maps enum values to numeric ranks (higher = better) */
  rankMap?: Record<string, number>;
  /** For count mode — which array field to compare lengths of */
  countKey?: keyof Vehicle;
}

/** Grouped spec rows for category-based rendering */
export interface CompareSpecGroup {
  title: string;
  icon: React.ReactNode;
  rows: CompareSpecRow[];
}
