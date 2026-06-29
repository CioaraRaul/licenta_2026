import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSaveVehicle } from "~/hooks/useSaveVehicle";
import { useAuthStore } from "~/store/auth.store";
import { formatCurrencyFull, formatMileage, formatRelativeTime } from "~/utils/format.utils";
import { buildVehicleSpecs } from "~/utils/findVehicle.utils";
import { getFuelTypeLabel, getTransmissionLabel } from "~/utils/vehicle.utils";
import type { VehicleDetailPageData } from "~/interface/vehicle.interface";
import { placeBid } from "~/api/bids.api";
import { getWallet } from "~/api/wallet.api";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  GaugeIcon,
  FuelIcon,
  GearIcon,
  ImagePlaceholderIcon,
  CheckCircleIcon,
  XCircleIcon,
  MessageIcon,
  BidIcon,
} from "./VehicleDetailIcons";

/* ── Component ───────────────────────────────────────────────────────────── */

export default function VehicleDetailComponent({
  vehicle,
  similarVehicles,
  isSaved: initialIsSaved,
  error,
}: VehicleDetailPageData) {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const { isSaved, toggleSave } = useSaveVehicle(vehicle?.id, initialIsSaved);
  const user = useAuthStore((s) => s.user);
  const isBuyer = user?.role === "buyer";

  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletFetching, setWalletFetching] = useState(false);

  const openBidModal = async () => {
    setBidModalOpen(true);
    setBidAmount("");
    setBidMessage("");
    setBidError(null);
    setBidSuccess(false);
    setWalletFetching(true);
    try {
      const w = await getWallet();
      setWalletBalance(w.balance);
    } catch {
      setWalletBalance(null);
    } finally {
      setWalletFetching(false);
    }
  };

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      setBidError("Enter a valid amount greater than 0.");
      return;
    }
    setBidLoading(true);
    setBidError(null);
    try {
      await placeBid(vehicle!.id, { amount, message: bidMessage.trim() || undefined });
      setBidSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setBidError(Array.isArray(msg) ? msg[0] : (msg ?? "Failed to place bid. Please try again."));
    } finally {
      setBidLoading(false);
    }
  };

  /* ── Error state ────────────────────────────────────────────────────── */
  if (error || !vehicle) {
    return (
      <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
        <div className="max-w-300 mx-auto">
          <div className="bg-[#141417] border border-red-500/10 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/6 border border-red-500/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#f5f5f7] mb-2">
              Vehicle not found
            </h3>
            <p className="text-sm text-[#8e8e9a] max-w-md mx-auto leading-relaxed mb-6">
              The vehicle you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/find-vehicle")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e63946]/10 hover:bg-[#e63946]/15 text-[#e63946] text-sm font-medium rounded-lg border border-[#e63946]/10 transition-colors cursor-pointer"
            >
              <ArrowLeftIcon /> Back to listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = vehicle.images ?? [];
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const hasMultipleImages = images.length > 1;
  const specs = buildVehicleSpecs(vehicle);

  return (
    <div className="flex-1 overflow-y-auto font-['DM_Sans',sans-serif]">
      <div className="max-w-350 mx-auto px-6 py-6">
        {/* ── Breadcrumb + Back ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/find-vehicle")}
              className="p-2 rounded-lg bg-white/4 border border-white/6 text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.07] transition-colors cursor-pointer"
              title="Back to listings"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-2 text-[13px] text-[#8e8e9a]">
              <Link to="/find-vehicle" className="hover:text-[#f5f5f7] transition-colors">
                Find Vehicle
              </Link>
              <span className="text-[#555]">/</span>
              <span className="text-[#f5f5f7] font-medium">{title}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSave}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                isSaved
                  ? "bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/20"
                  : "bg-white/4 border border-white/6 text-[#8e8e9a] hover:text-[#e63946] hover:border-[#e63946]/20"
              }`}
            >
              <HeartIcon filled={isSaved} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium bg-white/4 border border-white/6 text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.07] transition-colors cursor-pointer"
            >
              <ShareIcon /> Share
            </button>
          </div>
        </div>

        {/* ── Main grid: gallery + info ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Image gallery — 3/5 */}
          <div className="lg:col-span-3 space-y-3">
            {/* Main image */}
            <div className="relative bg-[#0c0c0e] rounded-2xl overflow-hidden aspect-[16/10] border border-white/6">
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

              {/* Nav arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                    title="Previous image"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                    title="Next image"
                  >
                    <ChevronRightIcon />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[12px] text-white font-medium">
                    {imageIndex + 1} / {images.length}
                  </div>
                </>
              )}

              {/* Status / featured badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {vehicle.isFeatured && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#e63946]/90 text-[11px] font-bold text-white uppercase tracking-wide">
                    Featured
                  </span>
                )}
                {vehicle.condition === "new" && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-[11px] font-bold text-white uppercase tracking-wide">
                    New
                  </span>
                )}
                {vehicle.condition === "certified_pre_owned" && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/90 text-[11px] font-bold text-white uppercase tracking-wide">
                    CPO
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === imageIndex
                        ? "border-[#e63946] opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info panel — 2/5 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title + Price card */}
            <div className="bg-[#141417] border border-white/6 rounded-2xl p-5">
              <h1 className="font-['Playfair_Display',serif] text-[24px] font-bold text-[#f5f5f7] tracking-tight leading-tight">
                {title}
              </h1>
              {vehicle.trim && (
                <p className="text-[13px] text-[#8e8e9a] mt-0.5">{vehicle.trim}</p>
              )}

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-[28px] font-bold text-[#f5f5f7]">
                  {formatCurrencyFull(vehicle.price)}
                </span>
                {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                  <span className="text-[15px] text-[#555] line-through">
                    {formatCurrencyFull(vehicle.originalPrice)}
                  </span>
                )}
              </div>
              {vehicle.negotiable && (
                <span className="inline-block mt-1.5 text-[12px] text-emerald-400 font-medium">
                  Price is negotiable
                </span>
              )}

              {/* Quick stats */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-[13px] text-[#8e8e9a]">
                  <GaugeIcon />
                  <span>{formatMileage(vehicle.mileage)}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#8e8e9a]">
                  <FuelIcon />
                  <span>{getFuelTypeLabel(vehicle.fuelType)}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#8e8e9a]">
                  <GearIcon />
                  <span>{getTransmissionLabel(vehicle.transmission)}</span>
                </div>
              </div>

              {/* Location + Date */}
              <div className="mt-4 flex items-center gap-4 text-[12px] text-[#666]">
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon /> {vehicle.city}, {vehicle.country}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon /> Listed {formatRelativeTime(vehicle.createdAt)}
                </span>
              </div>

              {/* Views count */}
              <div className="mt-2 flex items-center gap-1 text-[11px] text-[#555]">
                <EyeIcon /> {vehicle.viewsCount} views
              </div>
            </div>

            {/* Seller card */}
            {vehicle.seller && (
              <div className="bg-[#141417] border border-white/6 rounded-2xl p-5">
                <p className="text-[11px] uppercase tracking-wider text-[#555] font-semibold mb-3">
                  Seller
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#e63946]/20 to-[#e63946]/5 border border-[#e63946]/10 flex items-center justify-center text-[14px] font-bold text-[#e63946] uppercase">
                    {vehicle.seller.firstName?.[0]}{vehicle.seller.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#f5f5f7]">
                      {vehicle.seller.firstName} {vehicle.seller.lastName}
                    </p>
                    <p className="text-[12px] text-[#8e8e9a]">
                      {vehicle.city}, {vehicle.country}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/messages/${vehicle.sellerId}?vehicleId=${vehicle.id}`)}
                    disabled={!isBuyer}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                      !isBuyer
                        ? "bg-white/4 text-[#555] cursor-not-allowed"
                        : "bg-[#e63946] hover:bg-[#d32f3f] text-white cursor-pointer"
                    }`}
                  >
                    <MessageIcon /> Contact Seller
                  </button>
                  {isBuyer && (
                    <button
                      type="button"
                      onClick={openBidModal}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                    >
                      <BidIcon /> Place Bid
                    </button>
                  )}
                </div>
                {!isBuyer && (
                  <p className="mt-2 text-[13px] text-[#8e8e9a] text-center font-semibold">
                    Only buyer accounts can contact sellers or place bids.
                  </p>
                )}
              </div>
            )}

            {/* VIN card */}
            <div className="bg-[#141417] border border-white/6 rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-[#555] font-semibold mb-2">
                Vehicle Identification
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#f5f5f7] font-mono tracking-wider" title={vehicle.vin}>
                  {vehicle.vin}
                </p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(vehicle.vin)}
                  className="text-[11px] text-[#8e8e9a] hover:text-[#f5f5f7] transition-colors cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Specs grid ─────────────────────────────────────────────── */}
        <div className="mt-6 bg-[#141417] border border-white/6 rounded-2xl p-6">
          <h2 className="text-[16px] font-semibold text-[#f5f5f7] mb-4">
            Specifications
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {specs.map((s) => (
              <div key={s.label} className="bg-white/3 rounded-xl px-3.5 py-3">
                <p className="text-[11px] text-[#8e8e9a] uppercase tracking-wider mb-1">
                  {s.label}
                </p>
                <p className="text-[14px] text-[#f5f5f7] font-medium capitalize">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── History ────────────────────────────────────────────────── */}
        <div className="mt-4 bg-[#141417] border border-white/6 rounded-2xl p-6">
          <h2 className="text-[16px] font-semibold text-[#f5f5f7] mb-4">
            Vehicle History
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/3 rounded-xl px-3.5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8e8e9a] uppercase tracking-wider">Prev. Owners</p>
                <p className="text-[14px] text-[#f5f5f7] font-medium">{vehicle.previousOwners}</p>
              </div>
            </div>
            <div className="bg-white/3 rounded-xl px-3.5 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${vehicle.accidentHistory ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                {vehicle.accidentHistory ? <XCircleIcon /> : <CheckCircleIcon />}
              </div>
              <div>
                <p className="text-[11px] text-[#8e8e9a] uppercase tracking-wider">Accidents</p>
                <p className={`text-[14px] font-medium ${vehicle.accidentHistory ? "text-red-400" : "text-emerald-400"}`}>
                  {vehicle.accidentHistory ? "Reported" : "Clean"}
                </p>
              </div>
            </div>
            <div className="bg-white/3 rounded-xl px-3.5 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${vehicle.warrantyAvailable ? "bg-emerald-500/10 text-emerald-400" : "bg-white/4 text-[#555]"}`}>
                <CheckCircleIcon />
              </div>
              <div>
                <p className="text-[11px] text-[#8e8e9a] uppercase tracking-wider">Warranty</p>
                <p className={`text-[14px] font-medium ${vehicle.warrantyAvailable ? "text-emerald-400" : "text-[#8e8e9a]"}`}>
                  {vehicle.warrantyAvailable ? "Active" : "None"}
                </p>
              </div>
            </div>
            <div className="bg-white/3 rounded-xl px-3.5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>
              <div>
                <p className="text-[11px] text-[#8e8e9a] uppercase tracking-wider">Service</p>
                <p className="text-[14px] text-[#f5f5f7] font-medium">
                  {vehicle.serviceHistory ? "Available" : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Features + Safety ──────────────────────────────────────── */}
        {((vehicle.features && vehicle.features.length > 0) ||
          (vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0)) && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-[#141417] border border-white/6 rounded-2xl p-6">
                <h2 className="text-[16px] font-semibold text-[#f5f5f7] mb-4">
                  Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 rounded-lg bg-white/4 text-[12px] text-[#c5c5d0] border border-white/6"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0 && (
              <div className="bg-[#141417] border border-white/6 rounded-2xl p-6">
                <h2 className="text-[16px] font-semibold text-[#f5f5f7] mb-4">
                  Safety
                </h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.safetyFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/8 text-[12px] text-emerald-400 border border-emerald-500/12"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Description ────────────────────────────────────────────── */}
        {vehicle.description && (
          <div className="mt-4 bg-[#141417] border border-white/6 rounded-2xl p-6">
            <h2 className="text-[16px] font-semibold text-[#f5f5f7] mb-3">
              Description
            </h2>
            <p className="text-[14px] text-[#8e8e9a] leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>
        )}

        {/* ── Similar vehicles ───────────────────────────────────────── */}
        {similarVehicles.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[16px] font-semibold text-[#f5f5f7] mb-4">
              Similar Vehicles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarVehicles.map((sv) => {
                const svTitle = `${sv.year} ${sv.make} ${sv.model}`;
                const svThumb = sv.images?.[0] ?? null;
                return (
                  <Link
                    key={sv.id}
                    to={`/find-vehicle/${sv.id}`}
                    className="group bg-[#141417] border border-white/6 rounded-xl overflow-hidden hover:border-white/12 transition-all"
                  >
                    <div className="relative aspect-[16/10] bg-[#0c0c0e] overflow-hidden">
                      {svThumb ? (
                        <img
                          src={svThumb}
                          alt={svTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImagePlaceholderIcon />
                        </div>
                      )}
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-[13px] font-semibold text-[#f5f5f7] truncate group-hover:text-[#e63946] transition-colors">
                        {svTitle}
                      </h3>
                      <p className="text-[15px] font-bold text-[#f5f5f7] mt-1">
                        {formatCurrencyFull(sv.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#8e8e9a]">
                        <span>{formatMileage(sv.mileage)}</span>
                        <span>{getFuelTypeLabel(sv.fuelType)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

      {/* ── Place Bid Modal ─────────────────────────────────────────── */}
      {bidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !bidLoading && setBidModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#141417] border border-white/8 rounded-2xl shadow-2xl font-['DM_Sans',sans-serif]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/6">
              <div>
                <h2 className="text-[16px] font-semibold text-[#f5f5f7]">Place a Bid</h2>
                <p className="text-[12px] text-[#8e8e9a] mt-0.5">{title}</p>
              </div>
              <button
                type="button"
                title="Close"
                onClick={() => !bidLoading && setBidModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/6 transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {bidSuccess ? (
              /* ── Success state ── */
              <div className="px-6 py-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 className="text-[16px] font-semibold text-[#f5f5f7] mb-1">Bid Placed!</h3>
                <p className="text-[13px] text-[#8e8e9a] mb-6">
                  Your bid of <span className="text-emerald-400 font-semibold">{formatCurrencyFull(parseFloat(bidAmount))}</span> has been submitted. The seller will be notified.
                </p>
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => navigate("/bids")}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  >
                    View My Bids
                  </button>
                  <button
                    type="button"
                    onClick={() => setBidModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-white/6 hover:bg-white/10 text-[#f5f5f7] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <div className="px-6 py-5 space-y-4">
                {/* Listing price reference */}
                <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white/3 border border-white/6">
                  <span className="text-[12px] text-[#8e8e9a]">Listing price</span>
                  <span className="text-[14px] font-semibold text-[#f5f5f7]">{formatCurrencyFull(vehicle.price)}</span>
                </div>

                {/* Wallet balance */}
                <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white/3 border border-white/6">
                  <span className="text-[12px] text-[#8e8e9a]">Wallet balance</span>
                  {walletFetching ? (
                    <span className="text-[12px] text-[#555]">Loading…</span>
                  ) : walletBalance !== null ? (
                    <span className={`text-[14px] font-semibold ${parseFloat(bidAmount || "0") > walletBalance ? "text-amber-400" : "text-emerald-400"}`}>
                      {formatCurrencyFull(walletBalance)}
                    </span>
                  ) : (
                    <span className="text-[12px] text-[#555]">Unavailable</span>
                  )}
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-[12px] text-[#8e8e9a] mb-1.5">Bid Amount <span className="text-[#e63946]">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-[#8e8e9a] font-medium">$</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={bidAmount}
                      onChange={(e) => { setBidAmount(e.target.value); setBidError(null); }}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-[14px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  {walletBalance !== null && parseFloat(bidAmount || "0") > walletBalance && (
                    <p className="mt-1.5 text-[12px] text-amber-400">Insufficient wallet balance. Top up before the seller accepts.</p>
                  )}
                </div>

                {/* Message input */}
                <div>
                  <label className="block text-[12px] text-[#8e8e9a] mb-1.5">Message to Seller <span className="text-[#555]">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="Add a note to your bid…"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/4 border border-white/8 text-[14px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Error */}
                {bidError && (
                  <p className="text-[12px] text-[#e63946] bg-[#e63946]/8 border border-[#e63946]/15 rounded-xl px-3.5 py-2.5">{bidError}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setBidModalOpen(false)}
                    disabled={bidLoading}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-white/6 hover:bg-white/10 text-[#f5f5f7] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceBid}
                    disabled={bidLoading || !bidAmount}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bidLoading ? "Placing…" : "Place Bid"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
