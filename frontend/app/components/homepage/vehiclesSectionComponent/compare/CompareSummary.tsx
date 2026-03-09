import { useMemo } from "react";
import type { Vehicle } from "~/interface/vehicle.interface";
import { calculateSimilarity } from "~/utils/compare.utils";

interface CompareSummaryProps {
  vehicles: Vehicle[];
}

export default function CompareSummary({ vehicles }: CompareSummaryProps) {
  const similarities = useMemo(() => {
    if (vehicles.length < 2) return [];

    const pairs: { a: string; b: string; score: number }[] = [];
    for (let i = 0; i < vehicles.length; i++) {
      for (let j = i + 1; j < vehicles.length; j++) {
        const score = calculateSimilarity(vehicles[i], vehicles[j]);
        pairs.push({
          a: `${vehicles[i].year} ${vehicles[i].make} ${vehicles[i].model}`,
          b: `${vehicles[j].year} ${vehicles[j].make} ${vehicles[j].model}`,
          score,
        });
      }
    }
    return pairs;
  }, [vehicles]);

  if (similarities.length === 0) return null;

  return (
    <div className="bg-[#141417] border border-white/6 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-[#f5f5f7]">
        Similarity Overview
      </h3>

      <div className="space-y-2.5">
        {similarities.map(({ a, b, score }, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8e8e9a] truncate">
                {a} <span className="text-[#555]">vs</span> {b}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-24 h-1.5 rounded-full bg-white/6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 70
                    ? "bg-[#10b981]"
                    : score >= 40
                      ? "bg-[#f59e0b]"
                      : "bg-[#8e8e9a]"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>

            <span
              className={`text-xs font-semibold w-10 text-right ${
                score >= 70
                  ? "text-[#10b981]"
                  : score >= 40
                    ? "text-[#f59e0b]"
                    : "text-[#8e8e9a]"
              }`}
            >
              {score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
