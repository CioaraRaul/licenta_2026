import { useCompareActions } from "~/hooks/useCompareActions";
import { MAX_COMPARE_VEHICLES } from "~/constants/compare.constants";
import CompareHeader from "./CompareHeader";
import CompareCard from "./CompareCard";
import CompareEmptySlot from "./CompareEmptySlot";
import CompareTable from "./CompareTable";
import CompareSearchModal from "./CompareSearchModal";
import CompareSummary from "./CompareSummary";
import { CompareIcon, SpinnerIcon } from "./CompareIcons";

export default function CompareComponent() {
  const {
    vehicles,
    vehicleIds,
    isLoading,
    error,
    isSearchOpen,
    canAddMore,
    handleAddVehicle,
    handleRemoveVehicle,
    handleClearAll,
    openSearch,
    closeSearch,
  } = useCompareActions();

  const emptySlots = canAddMore
    ? Array.from({ length: MAX_COMPARE_VEHICLES - vehicles.length })
    : [];

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isLoading && vehicles.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="text-[#8e8e9a] mb-4">
          <SpinnerIcon />
        </div>
        <p className="text-sm text-[#8e8e9a]">Loading vehicles...</p>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────────────────
  if (error && vehicles.length === 0) {
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
        <p className="text-sm text-[#8e8e9a] mb-6 max-w-sm">{error}</p>
        <button
          onClick={handleClearAll}
          className="px-5 py-2 rounded-lg bg-white/6 text-[#f5f5f7] text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
        >
          Clear & retry
        </button>
      </div>
    );
  }

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (vehicleIds.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1c1c20] flex items-center justify-center mb-5 text-[#8e8e9a]">
          <CompareIcon />
        </div>
        <h2 className="text-xl font-bold text-[#f5f5f7] mb-2">
          No vehicles to compare
        </h2>
        <p className="text-sm text-[#8e8e9a] mb-6 max-w-sm">
          Add vehicles from the search to start comparing specs, pricing, and
          features side by side.
        </p>
        <button
          onClick={openSearch}
          className="px-6 py-2.5 rounded-lg bg-[#e63946] text-white text-sm font-medium hover:bg-[#d42e3b] transition-colors cursor-pointer"
        >
          Add first vehicle
        </button>

        <CompareSearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onSelect={handleAddVehicle}
          excludeIds={vehicleIds}
        />
      </div>
    );
  }

  // ─── Main compare view ────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
      {/* Header */}
      <CompareHeader
        vehicleCount={vehicles.length}
        maxVehicles={MAX_COMPARE_VEHICLES}
        onClearAll={handleClearAll}
      />

      {/* Vehicle cards row */}
      <div className="grid grid-cols-4 gap-4">
        {vehicles.map((vehicle) => (
          <CompareCard
            key={vehicle.id}
            vehicle={vehicle}
            onRemove={handleRemoveVehicle}
          />
        ))}
        {emptySlots.map((_, i) => (
          <CompareEmptySlot key={`empty-${i}`} onAddVehicle={openSearch} />
        ))}
      </div>

      {/* Similarity overview (only when 2+ vehicles) */}
      {vehicles.length >= 2 && <CompareSummary vehicles={vehicles} />}

      {/* Comparison table (only when 2+ vehicles) */}
      {vehicles.length >= 2 && <CompareTable vehicles={vehicles} />}

      {/* Hint text when only 1 vehicle */}
      {vehicles.length === 1 && (
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <p className="text-sm text-[#8e8e9a]">
              Add at least one more vehicle to start comparing
            </p>
            <button
              onClick={openSearch}
              className="mt-3 px-5 py-2 rounded-lg bg-[#e63946] text-white text-sm font-medium hover:bg-[#d42e3b] transition-colors cursor-pointer"
            >
              Add vehicle
            </button>
          </div>
        </div>
      )}

      {/* Search modal */}
      <CompareSearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onSelect={handleAddVehicle}
        excludeIds={vehicleIds}
      />
    </div>
  );
}
