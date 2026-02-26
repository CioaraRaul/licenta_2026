import type { ListingRowProps } from "~/interface/vehicle.interface";
import {
  getListingAge,
  getVehicleTitle,
  getVehicleThumbnail,
} from "~/utils/listing.utils";
import { formatCurrencyFull, formatMileage } from "~/utils/format.utils";
import { getVehicleStatusBadge } from "~/utils/vehicle.utils";
import ActionMenu from "./ActionMenu";

// ─── Listing Row ──────────────────────────────────────────────────────────────

export default function ListingRow({
  vehicle,
  isLoading,
  isMenuOpen,
  onToggleMenu,
  onDeactivate,
  onReactivate,
  onMarkSold,
  onDelete,
}: ListingRowProps) {
  const badge = getVehicleStatusBadge(vehicle.status, vehicle.isActive);
  const thumbnail = getVehicleThumbnail(vehicle);
  const title = getVehicleTitle(vehicle);

  return (
    <div
      className={`grid grid-cols-[1fr_100px_80px_70px_90px_50px] gap-3 px-5 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors items-center ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Vehicle info */}
      <div className="flex items-center gap-3 min-w-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-12 h-8 rounded object-cover shrink-0 bg-white/[0.04]"
          />
        ) : (
          <div className="w-12 h-8 rounded bg-white/[0.04] shrink-0 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8e8e9a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-[#f5f5f7] truncate">
            {title}
          </div>
          <div className="text-[11px] text-[#8e8e9a]/60 mt-0.5">
            {getListingAge(vehicle.createdAt)} ·{" "}
            {formatMileage(vehicle.mileage)}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-[13px] font-semibold text-[#f5f5f7]">
        {formatCurrencyFull(vehicle.price)}
      </div>

      {/* Views */}
      <div className="text-[13px] text-[#8e8e9a]">
        {(vehicle.viewsCount ?? 0).toLocaleString()}
      </div>

      {/* Bids — placeholder count from saves/contacts */}
      <div className="text-[13px] text-[#8e8e9a]">
        {vehicle.savesCount ?? 0}
      </div>

      {/* Status badge */}
      <div>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Actions menu */}
      <div className="relative">
        <button
          onClick={onToggleMenu}
          title="Actions"
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8e8e9a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>

        {isMenuOpen && (
          <ActionMenu
            vehicle={vehicle}
            onDeactivate={onDeactivate}
            onReactivate={onReactivate}
            onMarkSold={onMarkSold}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
