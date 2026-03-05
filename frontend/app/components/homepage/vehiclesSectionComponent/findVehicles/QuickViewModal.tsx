import { useState } from "react";
import type { QuickViewModalProps } from "~/interface/vehicle.interface";
import { formatCurrencyFull } from "~/utils/format.utils";
import { buildVehicleSpecs } from "~/utils/findVehicle.utils";
import {
  CloseIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  ImagePlaceholderIcon,
} from "./FindVehicleIcons";

export default function QuickViewModal({
  vehicle,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: QuickViewModalProps) {
  const [imageIndex, setImageIndex] = useState(0);

  if (!isOpen || !vehicle) return null;

  const images = vehicle.images ?? [];
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const hasMultipleImages = images.length > 1;
  const specs = buildVehicleSpecs(vehicle);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#141417] border border-white/6 rounded-2xl w-full max-w-225 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#f5f5f7] truncate">
              {title}
            </h2>
            {vehicle.trim && (
              <p className="text-[12px] text-[#8e8e9a]">{vehicle.trim}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
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
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/6 transition-colors"
              title="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Image gallery */}
          <div className="relative bg-[#0c0c0e] aspect-video">
            {images.length > 0 ? (
              <img
                src={images[imageIndex]}
                alt={`${title} - Image ${imageIndex + 1}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImagePlaceholderIcon />
              </div>
            )}

            {/* Image nav */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={() =>
                    setImageIndex(
                      (i) => (i - 1 + images.length) % images.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  title="Previous image"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  title="Next image"
                >
                  <ChevronRightIcon />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === imageIndex ? "bg-white" : "bg-white/30"
                      }`}
                      title={`Image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Price + Location row */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#f5f5f7]">
                {formatCurrencyFull(vehicle.price)}
              </span>
              <span className="inline-flex items-center gap-1 text-[12px] text-[#8e8e9a]">
                <MapPinIcon /> {vehicle.city}, {vehicle.country}
              </span>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/3 rounded-lg px-3 py-2.5"
                >
                  <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
                    {s.label}
                  </p>
                  <p className="text-[13px] text-[#f5f5f7] font-medium capitalize">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h4 className="text-[12px] font-semibold text-[#f5f5f7] mb-2 uppercase tracking-wider">
                  Features
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.features.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-full bg-white/4 text-[11px] text-[#c5c5d0] border border-white/6"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Safety */}
            {vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0 && (
              <div>
                <h4 className="text-[12px] font-semibold text-[#f5f5f7] mb-2 uppercase tracking-wider">
                  Safety
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.safetyFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-full bg-emerald-500/8 text-[11px] text-emerald-400 border border-emerald-500/12"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div>
                <h4 className="text-[12px] font-semibold text-[#f5f5f7] mb-2 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-[13px] text-[#8e8e9a] leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* History */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/3 rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
                  Prev. Owners
                </p>
                <p className="text-[13px] text-[#f5f5f7] font-medium">
                  {vehicle.previousOwners}
                </p>
              </div>
              <div className="bg-white/3 rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
                  Accidents
                </p>
                <p
                  className={`text-[13px] font-medium ${vehicle.accidentHistory ? "text-[#f87171]" : "text-emerald-400"}`}
                >
                  {vehicle.accidentHistory ? "Yes" : "None"}
                </p>
              </div>
              <div className="bg-white/3 rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
                  Warranty
                </p>
                <p
                  className={`text-[13px] font-medium ${vehicle.warrantyAvailable ? "text-emerald-400" : "text-[#8e8e9a]"}`}
                >
                  {vehicle.warrantyAvailable ? "Active" : "None"}
                </p>
              </div>
              <div className="bg-white/3 rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
                  VIN
                </p>
                <p
                  className="text-[13px] text-[#f5f5f7] font-mono truncate"
                  title={vehicle.vin}
                >
                  {vehicle.vin}
                </p>
              </div>
            </div>

            {/* Seller */}
            {vehicle.seller && (
              <div className="flex items-center gap-3 p-3 bg-white/3 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center text-[13px] font-bold text-[#f5f5f7] uppercase">
                  {vehicle.seller.firstName?.[0]}
                  {vehicle.seller.lastName?.[0]}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#f5f5f7]">
                    {vehicle.seller.firstName} {vehicle.seller.lastName}
                  </p>
                  <p className="text-[11px] text-[#8e8e9a]">Seller</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
