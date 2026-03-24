import { useMemo } from "react";
import type { Vehicle } from "~/interface/vehicle.interface";
import { calculateSimilarity } from "~/utils/compare.utils";

interface CompareSummaryProps {
  vehicles: Vehicle[];
}

export default function CompareSummary({ vehicles }: CompareSummaryProps) {
  const pairs = useMemo(() => {
    if (vehicles.length < 2) return [];

    const result: Array<{ a: string; b: string; score: number }> = [];

    for (let i = 0; i < vehicles.length; i++) {
      for (let j = i + 1; j < vehicles.length; j++) {
        result.push({
          a: `${vehicles[i].year} ${vehicles[i].make} ${vehicles[i].model}`,
          b: `${vehicles[j].year} ${vehicles[j].make} ${vehicles[j].model}`,
          score: calculateSimilarity(vehicles[i], vehicles[j]),
        });
      }
    }
    return result;
  }, [vehicles]);

  if (pairs.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[#f5f5f7]">
        Similarity Overview
      </h3>

      {pairs.map(({ a, b, score }, idx) => (
        <div
          key={idx}
          className="bg-[#141417] border border-white/6 rounded-xl px-5 py-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#f5f5f7] font-medium truncate flex-1 min-w-0">
              {a}{" "}
              <span className="text-[#555] font-normal mx-1.5">vs</span> {b}
            </p>

            <div className="flex items-center gap-3 ml-4 shrink-0">
              <div className="w-28 h-1.5 rounded-full bg-white/6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
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
                className={`text-sm font-bold tabular-nums w-11 text-right ${
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
          </div>
        </div>
      ))}
    </div>
  );
}
