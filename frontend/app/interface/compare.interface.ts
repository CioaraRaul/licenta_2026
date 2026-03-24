// Barrel re-export — import from specific files for cleaner dependencies
export type {
  HighlightMode,
  CompareSpecRow,
  CompareSpecGroup,
} from "./compare-spec.interface";

export type {
  SimilarityItem,
  SimilarityResult,
} from "./compare-similarity.interface";

export type { CompareState } from "./compare-store.interface";

export type {
  ComparePageData,
  CompareComponentProps,
  CompareHeaderProps,
  CompareCardProps,
  CompareEmptySlotProps,
  CompareTableProps,
  CompareSearchModalProps,
  CompareWinnerBadgeProps,
} from "./compare-props.interface";
