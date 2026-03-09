import { useMemo } from "react";
import type { Vehicle } from "~/interface/vehicle.interface";
import type { CompareSpecRow } from "~/interface/compare.interface";
import {
  PRICING_SPECS,
  PERFORMANCE_SPECS,
  GENERAL_SPECS,
  HISTORY_SPECS,
  LOCATION_SPECS,
  FEATURES_SPECS,
  ANALYTICS_SPECS,
} from "~/constants/compare.constants";

/** Map vehicle count → Tailwind grid-cols class (2–4 columns) */
const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};
import { findWinnerIndex, getVehicleTitle } from "~/utils/compare.utils";
import {
  DollarIcon,
  EngineIcon,
  InfoIcon,
  ShieldIcon,
  MapIcon,
  TrophyIcon,
  StarIcon,
  ChartIcon,
} from "./CompareIcons";

interface CompareTableProps {
  vehicles: Vehicle[];
}

interface SpecGroupConfig {
  title: string;
  icon: React.ReactNode;
  rows: CompareSpecRow[];
}

export default function CompareTable({ vehicles }: CompareTableProps) {
  const groups: SpecGroupConfig[] = useMemo(
    () => [
      { title: "Pricing", icon: <DollarIcon />, rows: PRICING_SPECS },
      { title: "Performance", icon: <EngineIcon />, rows: PERFORMANCE_SPECS },
      { title: "General", icon: <InfoIcon />, rows: GENERAL_SPECS },
      {
        title: "History & Warranty",
        icon: <ShieldIcon />,
        rows: HISTORY_SPECS,
      },
      { title: "Location", icon: <MapIcon />, rows: LOCATION_SPECS },
      { title: "Features & Media", icon: <StarIcon />, rows: FEATURES_SPECS },
      {
        title: "Analytics & Listing",
        icon: <ChartIcon />,
        rows: ANALYTICS_SPECS,
      },
    ],
    [],
  );

  if (vehicles.length < 2) return null;

  return (
    <div className="bg-[#141417] border border-white/6 rounded-xl overflow-hidden">
      {/* Sticky vehicle name header */}
      <div className="flex border-b border-white/6 bg-[#141417] sticky top-0 z-10">
        <div className="w-40 shrink-0 px-5 py-3" />
        <div
          className={`flex-1 grid ${GRID_COLS[vehicles.length] ?? "grid-cols-2"}`}
        >
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="px-4 py-3 text-sm font-semibold text-[#f5f5f7] truncate"
              title={getVehicleTitle(vehicle)}
            >
              {getVehicleTitle(vehicle)}
            </div>
          ))}
        </div>
      </div>

      {groups.map((group, gi) => (
        <div key={group.title}>
          {/* Group header */}
          <div className="flex items-center gap-2 px-5 py-3 bg-white/2 border-b border-white/6">
            <span className="text-[#8e8e9a]">{group.icon}</span>
            <span className="text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider">
              {group.title}
            </span>
          </div>

          {/* Rows */}
          {group.rows.map((row) => (
            <SpecRow key={row.key} row={row} vehicles={vehicles} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Single spec row ──────────────────────────────────────────────────────────

function SpecRow({
  row,
  vehicles,
}: {
  row: CompareSpecRow;
  vehicles: Vehicle[];
}) {
  const winnerIdx = useMemo(() => {
    if (!row.highlight) return -1;
    return findWinnerIndex(vehicles, row.key as keyof Vehicle, row.highlight);
  }, [row, vehicles]);

  return (
    <div className="flex border-b border-white/3 last:border-b-0 hover:bg-white/2 transition-colors">
      {/* Label */}
      <div className="w-40 shrink-0 px-5 py-3 flex items-center">
        <span className="text-xs text-[#8e8e9a] font-medium">{row.label}</span>
      </div>

      {/* Values */}
      <div
        className={`flex-1 grid ${GRID_COLS[vehicles.length] ?? "grid-cols-2"}`}
      >
        {vehicles.map((vehicle, vi) => {
          const value = row.getValue(vehicle);
          const isWinner = winnerIdx === vi;

          return (
            <div
              key={vehicle.id}
              className={`px-4 py-3 flex items-center gap-1.5 text-sm ${
                isWinner ? "text-[#10b981] font-semibold" : "text-[#f5f5f7]"
              }`}
            >
              {isWinner && (
                <span className="text-[#10b981]">
                  <TrophyIcon />
                </span>
              )}
              <span className={value === "—" ? "text-[#555]" : ""}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
