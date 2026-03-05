import { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { getVehicles } from "~/api/vehicles.api";
import { saveVehicle, unsaveVehicle } from "~/api/saved-vehicles.api";
import { VEHICLES_PER_PAGE } from "~/constants/findVehicle.constants";
import { paramsToFilters, filtersToParams } from "~/utils/findVehicle.utils";
import { useAuthStore } from "~/store/auth.store";
import { HttpError } from "~/api/http.api";
import type {
  Vehicle,
  FilterVehicleParams,
  ViewMode,
  FindVehicleProps,
} from "~/interface/vehicle.interface";
import FilterSidebar from "./FilterSidebar";
import ActiveFilters from "./ActiveFilters";
import ResultsHeader from "./ResultsHeader";
import VehicleGrid from "./VehicleGrid";
import Pagination from "./Pagination";
import QuickViewModal from "./QuickViewModal";

/* ── Component ───────────────────────────────────────────────────────────── */

export default function FindVehiclesComponent({
  vehicles: initialVehicles,
  total: initialTotal,
  page: initialPage,
  savedIds: initialSavedIds,
  error,
}: FindVehicleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [savedIds, setSavedIds] = useState<Set<number>>(initialSavedIds);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickViewVehicle, setQuickViewVehicle] = useState<Vehicle | null>(
    null,
  );

  const filters = paramsToFilters(searchParams);

  /* ── Fetch vehicles with given filters ─────────────────────────────────── */
  const fetchVehicles = useCallback(async (newFilters: FilterVehicleParams) => {
    setIsLoading(true);
    try {
      const result = await getVehicles({
        ...newFilters,
        limit: VEHICLES_PER_PAGE,
      });
      setVehicles(result.data);
      setTotal(result.total);
      setPage(result.page);
    } catch {
      /* keep current */
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── Filter change → update URL → fetch ────────────────────────────────── */
  const handleFilterChange = useCallback(
    (newFilters: FilterVehicleParams) => {
      const urlParams = filtersToParams(newFilters);
      setSearchParams(urlParams, { replace: true });
      fetchVehicles(newFilters);
    },
    [setSearchParams, fetchVehicles],
  );

  const handleRemoveFilter = useCallback(
    (key: string) => {
      const updated = { ...filters, [key]: undefined, page: 1 };
      handleFilterChange(updated);
    },
    [filters, handleFilterChange],
  );

  const handleClearAll = useCallback(() => {
    setSearchParams({}, { replace: true });
    fetchVehicles({
      page: 1,
      limit: VEHICLES_PER_PAGE,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
  }, [setSearchParams, fetchVehicles]);

  /* ── Sort ───────────────────────────────────────────────────────────────── */
  const handleSortChange = useCallback(
    (sortKey: string) => {
      const [sortBy, sortOrder] = sortKey.split("-") as [
        FilterVehicleParams["sortBy"],
        FilterVehicleParams["sortOrder"],
      ];
      handleFilterChange({ ...filters, sortBy, sortOrder, page: 1 });
    },
    [filters, handleFilterChange],
  );

  /* ── Pagination ────────────────────────────────────────────────────────── */
  const handlePageChange = useCallback(
    (newPage: number) => {
      handleFilterChange({ ...filters, page: newPage });
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters, handleFilterChange],
  );

  /* ── Save / unsave ─────────────────────────────────────────────────────── */
  const handleToggleSave = useCallback(
    async (vehicleId: number) => {
      if (!isAuthenticated) {
        navigate("/auth/login");
        return;
      }
      const wasSaved = savedIds.has(vehicleId);
      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(vehicleId);
        else next.add(vehicleId);
        return next;
      });
      try {
        if (wasSaved) await unsaveVehicle(vehicleId);
        else await saveVehicle(vehicleId);
      } catch (err) {
        // 409 = already saved, 404 = already unsaved — keep the optimistic state
        if (
          err instanceof HttpError &&
          (err.status === 409 || err.status === 404)
        ) {
          return;
        }
        // Revert on other errors
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(vehicleId);
          else next.delete(vehicleId);
          return next;
        });
      }
    },
    [savedIds, isAuthenticated, navigate],
  );

  /* ── Error state ───────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
        <div className="max-w-300 mx-auto">
          <div className="bg-[#141417] border border-red-500/10 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/6 border border-red-500/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-red-400"
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
            <h3 className="text-lg font-semibold text-[#f5f5f7] mb-2">
              Unable to load vehicles
            </h3>
            <p className="text-sm text-[#8e8e9a] max-w-md mx-auto leading-relaxed mb-6">
              Something went wrong while fetching the listings. This might be a
              temporary issue — please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/15 text-red-400 text-sm font-medium rounded-lg border border-red-500/10 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
              Refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / VEHICLES_PER_PAGE));

  return (
    <div className="flex-1 flex overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Sidebar */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleClearAll}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalResults={total}
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-300 mx-auto">
          {/* Header */}
          <div className="mb-5">
            <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
              Find Vehicle
            </h1>
            <p className="text-sm text-[#8e8e9a] mt-1">
              Browse and search available vehicles.
            </p>
          </div>

          {/* Active filters */}
          <ActiveFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />

          {/* Results header */}
          <ResultsHeader
            total={total}
            sortBy={filters.sortBy ?? "createdAt"}
            sortOrder={filters.sortOrder ?? "DESC"}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
            onToggleSidebar={() => setSidebarOpen(true)}
          />

          {/* Loading overlay */}
          <div
            className={
              isLoading
                ? "opacity-50 pointer-events-none transition-opacity"
                : "transition-opacity"
            }
          >
            <VehicleGrid
              vehicles={vehicles}
              viewMode={viewMode}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
              onQuickView={setQuickViewVehicle}
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Quick view modal */}
      <QuickViewModal
        vehicle={quickViewVehicle}
        isOpen={!!quickViewVehicle}
        onClose={() => setQuickViewVehicle(null)}
        isSaved={quickViewVehicle ? savedIds.has(quickViewVehicle.id) : false}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}
