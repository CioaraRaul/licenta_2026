import type { VehicleRowProps } from "~/interface/vehicle.interface";
import {
  formatCurrencyFull,
  formatMileage,
  formatRelativeTime,
} from "~/utils/format.utils";
import { getFuelTypeLabel, getTransmissionLabel } from "~/utils/vehicle.utils";
import {
  HeartIcon,
  EyeIcon,
  MapPinIcon,
  GaugeIcon,
  FuelIcon,
  GearIcon,
  ImagePlaceholderIcon,
} from "./FindVehicleIcons";

export default function VehicleRow({
  vehicle,
  isSaved,
  onToggleSave,
  onQuickView,
}: VehicleRowProps) {
  const thumbnail = vehicle.images?.[0] ?? null;
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <div className="group bg-[#141417] border border-white/6 rounded-xl overflow-hidden hover:border-white/12 transition-all duration-200 flex">
      {/* Thumbnail */}
      <div
        className="relative w-[220px] shrink-0 bg-[#0c0c0e] cursor-pointer overflow-hidden"
        onClick={() => onQuickView(vehicle)}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[140px]">
            <ImagePlaceholderIcon />
          </div>
        )}

        {/* Feature badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {vehicle.isFeatured && (
            <span className="px-2 py-0.5 rounded bg-[#e63946]/90 text-[10px] font-bold text-white uppercase tracking-wide">
              Featured
            </span>
          )}
          {vehicle.condition === "new" && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-[10px] font-bold text-white uppercase tracking-wide">
              New
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div className="space-y-2">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="text-[14px] font-semibold text-[#f5f5f7] truncate cursor-pointer hover:text-[#e63946] transition-colors"
                onClick={() => onQuickView(vehicle)}
                title={title}
              >
                {title}
              </h3>
              {vehicle.trim && (
                <p className="text-[11px] text-[#8e8e9a] truncate">
                  {vehicle.trim}
                </p>
              )}
            </div>
            <span className="text-base font-bold text-[#f5f5f7] shrink-0">
              {formatCurrencyFull(vehicle.price)}
            </span>
          </div>

          {/* Description snippet */}
          {vehicle.description && (
            <p className="text-[12px] text-[#8e8e9a] line-clamp-2 leading-relaxed">
              {vehicle.description}
            </p>
          )}

          {/* Specs */}
          <div className="flex items-center gap-4 text-[11px] text-[#8e8e9a]">
            <span className="inline-flex items-center gap-1">
              <GaugeIcon /> {formatMileage(vehicle.mileage)}
            </span>
            <span className="inline-flex items-center gap-1">
              <FuelIcon /> {getFuelTypeLabel(vehicle.fuelType)}
            </span>
            <span className="inline-flex items-center gap-1">
              <GearIcon /> {getTransmissionLabel(vehicle.transmission)}
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#666] truncate">
            <MapPinIcon /> {vehicle.city}, {vehicle.country}
            <span className="mx-1.5 text-white/12">•</span>
            {formatRelativeTime(vehicle.createdAt)}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onQuickView(vehicle)}
              className="p-2 rounded-lg hover:bg-white/6 text-[#8e8e9a] hover:text-[#f5f5f7] transition-colors"
              title="Quick view"
            >
              <EyeIcon />
            </button>
            <button
              onClick={() => onToggleSave(vehicle.id)}
              className={`p-2 rounded-lg transition-colors ${
                isSaved
                  ? "text-[#e63946] bg-[#e63946]/10"
                  : "text-[#8e8e9a] hover:text-[#e63946] hover:bg-white/6"
              }`}
              title={isSaved ? "Remove from saved" : "Save vehicle"}
            >
              <HeartIcon filled={isSaved} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
