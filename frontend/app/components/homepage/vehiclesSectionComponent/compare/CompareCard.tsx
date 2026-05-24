import type { CompareCardProps } from "~/interface/compare-props.interface";
import { getVehicleTitle } from "~/utils/compare.utils";
import { formatCurrencyFull } from "~/utils/format.utils";
import { XIcon, ImagePlaceholderIcon } from "./CompareIcons";

export default function CompareCard({ vehicle, onRemove }: CompareCardProps) {
  const title = getVehicleTitle(vehicle);
  const thumbnail = vehicle.images?.[0] ?? null;

  return (
    <div className="relative group h-full flex flex-col bg-[#141417] border border-white/6 rounded-xl overflow-hidden hover:border-white/12 transition-all duration-200">
      {/* Remove button */}
      <button
        onClick={() => onRemove(vehicle.id)}
        className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-[#e63946]/80 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
        title="Remove from compare"
      >
        <XIcon />
      </button>

      {/* Image — fixed aspect, centered with object-cover */}
      <div className="aspect-16/10 bg-[#0c0c0e] flex items-center justify-center overflow-hidden shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImagePlaceholderIcon />
        )}
      </div>

      {/* Title + price only — full specs live in the unified strip below */}
      <div className="flex-1 flex flex-col items-center text-center p-3.5 gap-1">
        <h3
          className="text-[13px] font-semibold text-[#f5f5f7] truncate w-full"
          title={title}
        >
          {title}
        </h3>
        <p className="text-[16px] font-bold text-[#e63946]">
          {formatCurrencyFull(vehicle.price)}
        </p>
      </div>
    </div>
  );
}
