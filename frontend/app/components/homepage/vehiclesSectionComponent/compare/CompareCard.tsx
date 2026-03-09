import type { CompareCardProps } from "~/interface/compare.interface";
import { getVehicleTitle } from "~/utils/compare.utils";
import { formatCurrencyFull, formatMileage } from "~/utils/format.utils";
import { getFuelTypeLabel, getTransmissionLabel } from "~/utils/vehicle.utils";
import { XIcon, ImagePlaceholderIcon } from "./CompareIcons";

export default function CompareCard({ vehicle, onRemove }: CompareCardProps) {
  const title = getVehicleTitle(vehicle);
  const thumbnail = vehicle.images?.[0] ?? null;

  return (
    <div className="relative group bg-[#141417] border border-white/6 rounded-xl overflow-hidden hover:border-white/12 transition-all duration-200">
      {/* Remove button */}
      <button
        onClick={() => onRemove(vehicle.id)}
        className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-[#e63946]/80 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
        title="Remove from compare"
      >
        <XIcon />
      </button>

      {/* Image */}
      <div className="aspect-16/10 bg-[#0c0c0e] overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlaceholderIcon />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5 space-y-2">
        <h3
          className="text-[13px] font-semibold text-[#f5f5f7] truncate"
          title={title}
        >
          {title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#e63946]">
            {formatCurrencyFull(vehicle.price)}
          </span>
          <span className="text-[11px] text-[#8e8e9a]">
            {formatMileage(vehicle.mileage)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#666]">
          <span>{getFuelTypeLabel(vehicle.fuelType)}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-[#333]" />
          <span>{getTransmissionLabel(vehicle.transmission)}</span>
          {vehicle.trim && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-[#333]" />
              <span className="truncate">{vehicle.trim}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
