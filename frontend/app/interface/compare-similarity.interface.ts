/** A single match/differ item in the detailed similarity breakdown */
export interface SimilarityItem {
  label: string;
  category: string;
  matches: boolean;
}

/** Detailed similarity result for a vehicle pair */
export interface SimilarityResult {
  overall: number;
  items: SimilarityItem[];
}
