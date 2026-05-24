import { Link } from "react-router";
import type { VehicleCardProps } from "~/interface/vehicle.interface";
import {
  formatCurrencyFull,
  formatMileage,
  formatRelativeTime,
} from "~/utils/format.utils";
import { getFuelTypeLabel, getTransmissionLabel } from "~/utils/vehicle.utils";
import {
  HeartIcon,
  MapPinIcon,
  GaugeIcon,
  FuelIcon,
  GearIcon,
  ImagePlaceholderIcon,
} from "./FindVehicleIcons";

export default function VehicleCard({
  vehicle,
  isSaved,
  onToggleSave,
}: VehicleCardProps) {
  const thumbnail = vehicle.images?.[0] ?? null;
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <div className="group h-full flex flex-col bg-[#141417] border border-white/6 rounded-xl overflow-hidden hover:border-white/12 transition-all duration-200">
      {/* Image area */}
      <Link
        to={`/find-vehicle/${vehicle.id}`}
        className="relative block aspect-16/10 bg-[#0c0c0e] cursor-pointer overflow-hidden"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlaceholderIcon />
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <span className="text-sm font-bold text-[#f5f5f7]">
            {formatCurrencyFull(vehicle.price)}
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(vehicle.id);
          }}
          className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer
            ${isSaved ? "bg-[#e63946]/20 text-[#e63946]" : "bg-black/50 text-white/60 hover:text-white hover:bg-black/70"}
          `}
          title={isSaved ? "Remove from saved" : "Save vehicle"}
        >
          <HeartIcon filled={isSaved} />
        </button>

        {/* View overlay */}
        <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-[12px] text-white font-medium">
            View Details
          </span>
        </div>

        {/* Feature badges */}
        <div className="absolute bottom-3 left-3 z-20 flex gap-1.5">
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
          {vehicle.condition === "certified_pre_owned" && (
            <span className="px-2 py-0.5 rounded bg-blue-500/90 text-[10px] font-bold text-white uppercase tracking-wide">
              CPO
            </span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col p-4 space-y-2.5">
        {/* Title */}
        <div>
          <Link
            to={`/find-vehicle/${vehicle.id}`}
            className="block text-[14px] font-semibold text-[#f5f5f7] truncate cursor-pointer hover:text-[#e63946] transition-colors"
            title={title}
          >
            {title}
          </Link>
          {/* Always reserve a line for trim so cards align even when trim is missing */}
          <p className="text-[11px] text-[#8e8e9a] truncate">
            {vehicle.trim || " "}
          </p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-[11px] text-[#8e8e9a]">
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

        {/* Location + time — pinned to bottom so all cards align */}
        <div className="mt-auto flex items-center justify-between text-[11px] text-[#666]">
          <span className="inline-flex items-center gap-1 truncate">
            <MapPinIcon /> {vehicle.city}, {vehicle.country}
          </span>
          <span className="shrink-0 ml-2">
            {formatRelativeTime(vehicle.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
