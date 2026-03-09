import { useMemo } from "react";
import type { Vehicle } from "~/interface/vehicle.interface";
import { CheckIcon, XSmallIcon } from "./CompareIcons";

/** Map vehicle count → Tailwind grid-cols class */
const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

interface FeatureMatrixProps {
  vehicles: Vehicle[];
  featureKey: "features" | "safetyFeatures";
  title: string;
}

export default function FeatureMatrix({
  vehicles,
  featureKey,
  title,
}: FeatureMatrixProps) {
  // Collect all unique features across vehicles, sorted alphabetically
  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>();
    vehicles.forEach((v) => {
      const arr = v[featureKey];
      if (Array.isArray(arr)) {
        arr.forEach((f) => featureSet.add(f.trim()));
      }
    });
    return Array.from(featureSet).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );
  }, [vehicles, featureKey]);

  // Pre-compute lookup sets for fast membership check
  const vehicleFeatureSets = useMemo(
    () =>
      vehicles.map((v) => {
        const arr = v[featureKey];
        return new Set(Array.isArray(arr) ? arr.map((f) => f.trim()) : []);
      }),
    [vehicles, featureKey],
  );

  if (allFeatures.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Matrix sub-header */}
      <div className="flex items-center gap-2 px-5 py-2 bg-white/1.5">
        <span className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">
          {title}
        </span>
        <span className="text-[10px] text-[#444]">
          ({allFeatures.length} unique)
        </span>
      </div>

      {/* Feature rows */}
      {allFeatures.map((feature) => (
        <div
          key={feature}
          className="flex border-b border-white/3 last:border-b-0 hover:bg-white/2 transition-colors"
        >
          {/* Feature name label */}
          <div className="w-40 shrink-0 px-5 py-2.5 flex items-center">
            <span
              className="text-[11px] text-[#8e8e9a] font-medium truncate"
              title={feature}
            >
              {feature}
            </span>
          </div>

          {/* Checkmarks per vehicle */}
          <div
            className={`flex-1 grid ${GRID_COLS[vehicles.length] ?? "grid-cols-2"}`}
          >
            {vehicles.map((vehicle, vi) => {
              const has = vehicleFeatureSets[vi].has(feature);
              return (
                <div
                  key={vehicle.id}
                  className="px-4 py-2.5 flex items-center justify-start"
                >
                  {has ? (
                    <span className="text-emerald-400">
                      <CheckIcon />
                    </span>
                  ) : (
                    <span className="text-[#444]">
                      <XSmallIcon />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
