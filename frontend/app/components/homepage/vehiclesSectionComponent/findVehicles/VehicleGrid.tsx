import type { Vehicle, ViewMode } from "~/interface/vehicle.interface";
import VehicleCard from "./VehicleCard";
import VehicleRow from "./VehicleRow";
import { EmptySearchIcon } from "./FindVehicleIcons";

interface VehicleGridProps {
  vehicles: Vehicle[];
  viewMode: ViewMode;
  savedIds: Set<number>;
  onToggleSave: (vehicleId: number) => void;
}

export default function VehicleGrid({
  vehicles,
  viewMode,
  savedIds,
  onToggleSave,
}: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className="bg-[#141417] border border-white/6 rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-white/[0.03] border border-white/6 flex items-center justify-center">
          <EmptySearchIcon />
        </div>
        <h3 className="text-lg font-semibold text-[#f5f5f7] mb-2">
          No vehicles available
        </h3>
        <p className="text-sm text-[#8e8e9a] max-w-md mx-auto leading-relaxed mb-6">
          We couldn&apos;t find any vehicles matching your current filters. Try
          broadening your search criteria or removing some filters.
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-[#55555e]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55555e]"></span>
            Adjust price range
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55555e]"></span>
            Change location
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55555e]"></span>
            Remove filters
          </span>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {vehicles.map((v) => (
          <VehicleRow
            key={v.id}
            vehicle={v}
            isSaved={savedIds.has(v.id)}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {vehicles.map((v) => (
        <VehicleCard
          key={v.id}
          vehicle={v}
          isSaved={savedIds.has(v.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
