import { useMemo } from "react";
import type { Vehicle } from "~/interface/vehicle.interface";
import { calculateDetailedSimilarity } from "~/utils/compare.utils";

interface CompareSummaryProps {
  vehicles: Vehicle[];
}

/**
 * One aggregate similarity score across ALL selected vehicles.
 *
 * For each attribute checked by `calculateDetailedSimilarity` we count
 * what fraction of vehicle pairs agree on that attribute. The overall score
 * is the average of those per-attribute agreement rates.
 *
 * For 2 vehicles this matches the pairwise number you'd see before; for 3+
 * it stays in 0-100 and degrades gracefully as cars diverge.
 */
function computeAggregateSimilarity(vehicles: Vehicle[]): {
  overall: number;
  matchingAttrs: string[];
  totalAttrs: number;
} {
  if (vehicles.length < 2) return { overall: 0, matchingAttrs: [], totalAttrs: 0 };

  const sample = calculateDetailedSimilarity(vehicles[0], vehicles[1]);
  const labels = sample.items.map((i) => i.label);
  const totalAttrs = labels.length;

  // For each attribute, average agreement rate across all C(n,2) pairs.
  const perAttrAgreement: number[] = new Array(totalAttrs).fill(0);
  let pairCount = 0;

  for (let i = 0; i < vehicles.length; i++) {
    for (let j = i + 1; j < vehicles.length; j++) {
      const pair = calculateDetailedSimilarity(vehicles[i], vehicles[j]);
      pair.items.forEach((item, idx) => {
        if (item.matches) perAttrAgreement[idx] += 1;
      });
      pairCount++;
    }
  }

  const matchingAttrs: string[] = [];
  let sumAgreement = 0;
  for (let idx = 0; idx < totalAttrs; idx++) {
    const rate = perAttrAgreement[idx] / pairCount;
    sumAgreement += rate;
    // Attribute is "shared" when all pairs agree on it
    if (perAttrAgreement[idx] === pairCount) matchingAttrs.push(labels[idx]);
  }

  const overall = Math.round((sumAgreement / totalAttrs) * 100);
  return { overall, matchingAttrs, totalAttrs };
}

export default function CompareSummary({ vehicles }: CompareSummaryProps) {
  const { overall, matchingAttrs, totalAttrs } = useMemo(
    () => computeAggregateSimilarity(vehicles),
    [vehicles],
  );

  if (vehicles.length < 2) return null;

  const barColor =
    overall >= 70
      ? "bg-[#10b981]"
      : overall >= 40
        ? "bg-[#f59e0b]"
        : "bg-[#8e8e9a]";
  const textColor =
    overall >= 70
      ? "text-[#10b981]"
      : overall >= 40
        ? "text-[#f59e0b]"
        : "text-[#8e8e9a]";

  return (
    <div className="bg-[#141417] border border-white/6 rounded-xl px-5 py-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#f5f5f7]">
            Similarity across {vehicles.length} vehicles
          </h3>
          <p className="text-[11px] text-[#8e8e9a] mt-0.5">
            {matchingAttrs.length} of {totalAttrs} attributes match for every selected vehicle
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-40 h-2 rounded-full bg-white/6 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${overall}%` }}
            />
          </div>
          <span className={`text-lg font-bold tabular-nums w-12 text-right ${textColor}`}>
            {overall}%
          </span>
        </div>
      </div>

      {matchingAttrs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/6">
          {matchingAttrs.map((attr) => (
            <span
              key={attr}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] font-medium"
            >
              {attr}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
