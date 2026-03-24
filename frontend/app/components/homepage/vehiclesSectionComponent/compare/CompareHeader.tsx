import type { CompareHeaderProps } from "~/interface/compare-props.interface";
import { TrashIcon } from "./CompareIcons";

export default function CompareHeader({
  vehicleCount,
  maxVehicles,
  onClearAll,
}: CompareHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#f5f5f7]">Compare Vehicles</h1>
        <p className="text-sm text-[#8e8e9a] mt-0.5">
          {vehicleCount} of {maxVehicles} vehicles selected
        </p>
      </div>

      {vehicleCount > 0 && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/4 text-[#8e8e9a] text-sm font-medium hover:bg-white/8 hover:text-[#f5f5f7] transition-colors cursor-pointer"
        >
          <TrashIcon />
          Clear all
        </button>
      )}
    </div>
  );
}
