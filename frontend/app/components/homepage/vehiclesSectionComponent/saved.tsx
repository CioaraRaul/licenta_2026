import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import { unsaveVehicle } from "~/api/saved-vehicles.api";
import { HttpError } from "~/api/http.api";
import type { SavedVehiclesProps } from "~/interface/saved-vehicle.interface";
import type { Vehicle, ViewMode } from "~/interface/vehicle.interface";
import VehicleCard from "~/components/homepage/vehiclesSectionComponent/findVehicles/VehicleCard";
import VehicleRow from "~/components/homepage/vehiclesSectionComponent/findVehicles/VehicleRow";
import Pagination from "~/components/homepage/vehiclesSectionComponent/findVehicles/Pagination";
import QuickViewModal from "~/components/homepage/vehiclesSectionComponent/findVehicles/QuickViewModal";
import {
  GridIcon,
  ListIcon,
  HeartIcon,
} from "~/components/homepage/vehiclesSectionComponent/findVehicles/FindVehicleIcons";

const LIMIT = 12;

export default function SavedComponent({
  vehicles: initialVehicles,
  total,
  page,
  error,
}: SavedVehiclesProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isTokenValid } = useAuthStore();

  const [vehicles, setVehicles] = useState(initialVehicles);

  // Re-sync local state when loader data changes (e.g. pagination)
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [quickViewVehicle, setQuickViewVehicle] = useState<Vehicle | null>(
    null,
  );

  const totalPages = Math.ceil(total / LIMIT);
  const isLoggedIn = isAuthenticated && isTokenValid();

  // ─── Unsave handler (optimistic removal with fade-out) ──────────────────────
  const handleUnsave = useCallback(
    async (vehicleId: number) => {
      // Start fade-out animation
      setRemovingIds((prev) => new Set(prev).add(vehicleId));

      // Wait for animation, then remove from list
      setTimeout(() => {
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(vehicleId);
          return next;
        });
      }, 300);

      // Fire API call
      try {
        await unsaveVehicle(vehicleId);
      } catch (err) {
        // If 404, vehicle was already unsaved — do nothing
        if (err instanceof HttpError && err.status === 404) return;

        // Real error → undo removal
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(vehicleId);
          return next;
        });
        const original = initialVehicles.find((v) => v.id === vehicleId);
        if (original) {
          setVehicles((prev) =>
            prev.some((v) => v.id === vehicleId) ? prev : [...prev, original],
          );
        }
      }
    },
    [initialVehicles],
  );

  // ─── Pagination handler ─────────────────────────────────────────────────────
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      navigate(`/saved?page=${newPage}`);
    },
    [navigate, totalPages],
  );

  // ─── Quick view ─────────────────────────────────────────────────────────────
  const handleQuickView = useCallback(
    (v: Vehicle) => setQuickViewVehicle(v),
    [],
  );
  const handleCloseQuickView = useCallback(() => setQuickViewVehicle(null), []);

  // ─── Auth gate ──────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#e63946]/10 flex items-center justify-center mb-5">
          <HeartIcon filled={false} />
        </div>
        <h2 className="text-xl font-bold text-[#f5f5f7] mb-2">
          Sign in to see saved vehicles
        </h2>
        <p className="text-sm text-[#8e8e9a] mb-6 max-w-sm">
          Create an account or sign in to save vehicles and access them anytime.
        </p>
        <button
          onClick={() => navigate("/auth/login")}
          className="px-6 py-2.5 rounded-lg bg-[#e63946] text-white text-sm font-medium hover:bg-[#d42e3b] transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[#f5f5f7] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[#8e8e9a] mb-6 max-w-sm">
          We couldn't load your saved vehicles. Please try again.
        </p>
        <button
          onClick={() => navigate(0)}
          className="px-5 py-2 rounded-lg bg-white/6 text-[#f5f5f7] text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Empty state ────────────────────────────────────────────────────────────
  if (vehicles.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1c1c20] flex items-center justify-center mb-5">
          <HeartIcon filled={false} />
        </div>
        <h2 className="text-xl font-bold text-[#f5f5f7] mb-2">
          No saved vehicles yet
        </h2>
        <p className="text-sm text-[#8e8e9a] mb-6 max-w-sm">
          Browse our listings and tap the heart icon to save vehicles you're
          interested in.
        </p>
        <button
          onClick={() => navigate("/find-vehicle")}
          className="px-6 py-2.5 rounded-lg bg-[#e63946] text-white text-sm font-medium hover:bg-[#d42e3b] transition-colors cursor-pointer"
        >
          Browse vehicles
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#f5f5f7]">Saved Vehicles</h1>
          <p className="text-sm text-[#8e8e9a] mt-0.5">
            {total} vehicle{total !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-[#1c1c20] rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-white/10 text-[#f5f5f7]"
                : "text-[#8e8e9a] hover:text-[#f5f5f7]"
            }`}
            title="Grid view"
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-white/10 text-[#f5f5f7]"
                : "text-[#8e8e9a] hover:text-[#f5f5f7]"
            }`}
            title="List view"
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Grid / List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`transition-all duration-300 ${
                removingIds.has(v.id)
                  ? "opacity-0 scale-95"
                  : "opacity-100 scale-100"
              }`}
            >
              <VehicleCard
                vehicle={v}
                isSaved={true}
                onToggleSave={handleUnsave}
                onQuickView={handleQuickView}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`transition-all duration-300 ${
                removingIds.has(v.id)
                  ? "opacity-0 scale-95"
                  : "opacity-100 scale-100"
              }`}
            >
              <VehicleRow
                vehicle={v}
                isSaved={true}
                onToggleSave={handleUnsave}
                onQuickView={handleQuickView}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        vehicle={quickViewVehicle}
        isOpen={!!quickViewVehicle}
        onClose={handleCloseQuickView}
        isSaved={true}
        onToggleSave={handleUnsave}
      />
    </div>
  );
}
