import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router";
import type {
  MyListingsPageData,
  ListingStatusFilter,
  ListingSortOption,
} from "~/interface/vehicle.interface";
import {
  computeListingStats,
  filterByStatus,
  searchListings,
  sortListings,
} from "~/utils/listing.utils";
import { useListingActions } from "~/hooks/useListingActions";
import {
  STATUS_TABS,
  SORT_OPTIONS,
  ITEMS_PER_PAGE,
} from "~/constants/listing.constants";
import ListingRow from "./myListings/ListingRow";
import EmptyState from "./myListings/EmptyState";

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MyListingsComponent({
  vehicles,
  error,
}: MyListingsPageData) {
  // ── Local UI state ───────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ListingStatusFilter>("all");
  const [sortBy, setSortBy] = useState<ListingSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Action state & handlers (from custom hook) ──────────────────────────
  const {
    actionLoading,
    openMenuId,
    setOpenMenuId,
    handleDeactivate,
    handleReactivate,
    handleMarkSold,
    handleDelete,
  } = useListingActions();

  // ── Derived data (filter → search → sort pipeline) ──────────────────────
  const stats = useMemo(() => computeListingStats(vehicles), [vehicles]);

  const filteredVehicles = useMemo(() => {
    const byStatus = filterByStatus(vehicles, statusFilter);
    const bySearch = searchListings(byStatus, search);
    return sortListings(bySearch, sortBy);
  }, [vehicles, statusFilter, search, sortBy]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  const handleFilterChange = useCallback((status: ListingStatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  // ── Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-10 text-center">
            <svg
              className="mx-auto mb-4 opacity-30"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8e8e9a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-[#8e8e9a] text-sm">
              Failed to load your listings. Please refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        {/* ─── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
              My Listings
            </h1>
            <p className="text-sm text-[#8e8e9a] mt-1">
              Manage your vehicle listings and track their performance.
            </p>
          </div>
          <Link
            to="/my-listings/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#e63946] hover:bg-[#d62b39] text-white text-[13px] font-semibold rounded-lg transition-colors no-underline"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Listing
          </Link>
        </div>

        {/* ─── Stats Bar ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-[#f5f5f7]" },
            { label: "Active", value: stats.active, color: "text-[#10b981]" },
            { label: "Pending", value: stats.pending, color: "text-[#f59e0b]" },
            { label: "Sold", value: stats.sold, color: "text-[#8e8e9a]" },
            {
              label: "Inactive",
              value: stats.inactive,
              color: "text-[#f87171]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#141417] border border-white/[0.04] rounded-xl px-4 py-3 text-center"
            >
              <div className={`text-[20px] font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="text-[11px] text-[#8e8e9a] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Toolbar: Tabs + Search + Sort ────────────────────────────── */}
        <div className="bg-[#141417] border border-white/[0.04] rounded-xl mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-white/[0.04]">
            {/* Status tabs */}
            <div className="flex items-center gap-1">
              {STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.key;
                const count =
                  tab.key === "all"
                    ? stats.total
                    : stats[tab.key as keyof typeof stats];
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleFilterChange(tab.key)}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/[0.08] text-[#f5f5f7]"
                        : "text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.04]"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-1.5 text-[11px] opacity-60">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8e8e9a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-[180px] pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#f5f5f7] placeholder-[#8e8e9a]/50 outline-none focus:border-white/[0.12] transition-colors"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ListingSortOption)}
                className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#f5f5f7] outline-none cursor-pointer focus:border-white/[0.12] transition-colors appearance-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.key}
                    value={opt.key}
                    className="bg-[#1a1a1e]"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ─── Listings Table ──────────────────────────────────────────── */}
          {paginatedVehicles.length === 0 ? (
            <EmptyState hasFilters={search !== "" || statusFilter !== "all"} />
          ) : (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_80px_70px_90px_50px] gap-3 px-5 py-2.5 border-b border-white/[0.02] text-[11px] text-[#8e8e9a]/60 uppercase tracking-wider font-semibold">
                <span>Vehicle</span>
                <span>Price</span>
                <span>Views</span>
                <span>Saves</span>
                <span>Status</span>
                <span />
              </div>

              {/* Table rows */}
              {paginatedVehicles.map((vehicle) => (
                <ListingRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  isLoading={actionLoading === vehicle.id}
                  isMenuOpen={openMenuId === vehicle.id}
                  onToggleMenu={() =>
                    setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)
                  }
                  onDeactivate={() => handleDeactivate(vehicle.id)}
                  onReactivate={() => handleReactivate(vehicle.id)}
                  onMarkSold={() => handleMarkSold(vehicle.id)}
                  onDelete={() => handleDelete(vehicle.id)}
                />
              ))}
            </div>
          )}

          {/* ─── Pagination ─────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
              <span className="text-[12px] text-[#8e8e9a]">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredVehicles.length,
                )}{" "}
                of {filteredVehicles.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-md text-[12px] text-[#8e8e9a] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-md text-[12px] font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#e63946] text-white"
                          : "text-[#8e8e9a] hover:bg-white/[0.04]"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-md text-[12px] text-[#8e8e9a] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
