import type { CompareEmptySlotProps } from "~/interface/compare-props.interface";
import { PlusIcon } from "./CompareIcons";

export default function CompareEmptySlot({
  onAddVehicle,
}: CompareEmptySlotProps) {
  return (
    <button
      onClick={onAddVehicle}
      className="flex flex-col items-center justify-center gap-3 w-full h-full min-h-55 bg-[#141417] border-2 border-dashed border-white/8 rounded-xl hover:border-[#e63946]/40 hover:bg-[#e63946]/3 transition-all duration-200 cursor-pointer group"
    >
      <div className="w-11 h-11 rounded-xl bg-white/4 flex items-center justify-center text-[#8e8e9a] group-hover:text-[#e63946] group-hover:bg-[#e63946]/10 transition-colors">
        <PlusIcon />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#8e8e9a] group-hover:text-[#f5f5f7] transition-colors">
          Add Vehicle
        </p>
        <p className="text-[11px] text-[#555] mt-0.5">
          Search and add to compare
        </p>
      </div>
    </button>
  );
}
