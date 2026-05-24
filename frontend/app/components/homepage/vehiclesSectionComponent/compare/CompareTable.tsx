import { useMemo } from "react";
import type { Vehicle } from "~/interface/vehicle.interface";
import type { CompareSpecRow } from "~/interface/compare-spec.interface";
import {
  PRICING_SPECS,
  PERFORMANCE_SPECS,
  IDENTITY_SPECS,
  APPEARANCE_SPECS,
  DETAILS_SPECS,
  HISTORY_SPECS,
  LOCATION_SPECS,
  FEATURES_SPECS,
  ANALYTICS_SPECS,
  MAX_COMPARE_VEHICLES,
} from "~/constants/compare.constants";
import { findWinnerIndex, getVehicleTitle } from "~/utils/compare.utils";
import { TrophyIcon } from "./CompareIcons";
import FeatureMatrix from "./FeatureMatrix";

interface CompareTableProps {
  vehicles: Vehicle[];
}

// Flatten all spec groups into a single list — no section headers.
const ALL_ROWS: CompareSpecRow[] = [
  ...PRICING_SPECS,
  ...PERFORMANCE_SPECS,
  ...IDENTITY_SPECS,
  ...APPEARANCE_SPECS,
  ...DETAILS_SPECS,
  ...HISTORY_SPECS,
  ...LOCATION_SPECS,
  ...FEATURES_SPECS,
  ...ANALYTICS_SPECS,
];

// Grid always spans MAX_COMPARE_VEHICLES (=4) so values align under the image row above,
// with empty placeholders for unselected slots. Class is hardcoded so Tailwind's JIT picks it up.
const COL_CLASS = "grid-cols-4";

export default function CompareTable({ vehicles }: CompareTableProps) {
  if (vehicles.length < 2) return null;

  const slots: (Vehicle | null)[] = Array.from(
    { length: MAX_COMPARE_VEHICLES },
    (_, i) => vehicles[i] ?? null,
  );

  return (
    <div className="bg-[#141417] border border-white/6 rounded-xl overflow-hidden flex flex-col max-h-[900px]">
      {/* Sticky vehicle name header — aligned to image row above */}
      <div className="flex border-b border-white/6 bg-[#141417] shrink-0">
        <div className="w-40 shrink-0 px-5 py-3" />
        <div className={`flex-1 grid ${COL_CLASS}`}>
          {slots.map((vehicle, i) => (
            <div
              key={vehicle?.id ?? `empty-${i}`}
              className="px-4 py-3 text-center text-sm font-semibold text-[#f5f5f7] truncate"
              title={vehicle ? getVehicleTitle(vehicle) : ""}
            >
              {vehicle ? getVehicleTitle(vehicle) : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable body — all spec rows + feature matrices */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {ALL_ROWS.map((row) => (
          <SpecRow key={row.key} row={row} vehicles={vehicles} slots={slots} />
        ))}

        <FeatureMatrix vehicles={vehicles} featureKey="features" title="Features" />
        <FeatureMatrix
          vehicles={vehicles}
          featureKey="safetyFeatures"
          title="Safety Features"
        />
      </div>
    </div>
  );
}

// ─── Single spec row ──────────────────────────────────────────────────────────

function SpecRow({
  row,
  vehicles,
  slots,
}: {
  row: CompareSpecRow;
  vehicles: Vehicle[];
  slots: (Vehicle | null)[];
}) {
  const winnerIdx = useMemo(() => {
    if (!row.highlight) return -1;
    try {
      return findWinnerIndex(
        vehicles,
        row.key as keyof Vehicle,
        row.highlight,
        row.rankMap,
        row.countKey,
      );
    } catch {
      return -1;
    }
  }, [row, vehicles]);

  return (
    <div className="flex border-b border-white/3 last:border-b-0 hover:bg-white/2 transition-colors">
      <div className="w-40 shrink-0 px-5 py-3 flex items-center">
        <span className="text-xs text-[#8e8e9a] font-medium">{row.label}</span>
      </div>

      <div className={`flex-1 grid ${COL_CLASS}`}>
        {slots.map((vehicle, si) => {
          if (!vehicle) {
            return (
              <div key={`empty-${si}`} className="px-4 py-3 text-center text-[#444]">
                —
              </div>
            );
          }
          let value: string;
          try {
            value = row.getValue(vehicle);
          } catch {
            value = "—";
          }
          // Find the index of this vehicle inside vehicles[] (not slots)
          const vi = vehicles.indexOf(vehicle);
          const isWinner = winnerIdx === vi;

          return (
            <div
              key={vehicle.id}
              className={`px-4 py-3 flex items-center justify-center gap-1.5 text-sm text-center ${
                isWinner ? "text-[#10b981] font-semibold" : "text-[#f5f5f7]"
              }`}
            >
              {isWinner && (
                <span className="text-[#10b981]">
                  <TrophyIcon />
                </span>
              )}
              <span className={value === "—" ? "text-[#555]" : ""}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
