import { useState, useCallback, useMemo } from "react";
import type {
  MyBidsPageData,
  MyBidsTab,
  BidStatusFilter,
  BidSortOption,
} from "~/interface/bid.interface";
import {
  computeBidStats,
  filterBidsByStatus,
  searchBids,
  sortBids,
} from "~/utils/bids.utils";
import { useBidActions } from "~/hooks/useBidActions";
import { useWithdrawBid } from "~/hooks/useWithdrawBid";
import { useRemoveBid } from "~/hooks/useRemoveBid";
import { BIDS_PAGE_TABS, BIDS_PER_PAGE } from "~/constants/bids.constants";

import BidsStatsBar from "./myBids/BidsStatsBar";
import BidsToolbar from "./myBids/BidsToolbar";
import BidsPagination from "./myBids/BidsPagination";
import BidsEmptyState from "./myBids/BidsEmptyState";
import ReceivedBidRow from "./myBids/ReceivedBidRow";
import PlacedBidRow from "./myBids/PlacedBidRow";
import RejectBidModal from "./myBids/RejectBidModal";

// ─── MyBidsComponent ──────────────────────────────────────────────────────────

export default function MyBidsComponent({
  placedBids,
  receivedBids,
  isSeller,
  error,
}: MyBidsPageData) {
  // ── Tab state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<MyBidsTab>(
    isSeller ? "received" : "placed",
  );

  // ── Filter / search / sort state ─────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BidStatusFilter>("all");
  const [sortBy, setSortBy] = useState<BidSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Reject modal state ───────────────────────────────────────────────────
  const [rejectModalBidId, setRejectModalBidId] = useState<number | null>(null);

  // ── Action hooks ─────────────────────────────────────────────────────────
  const { actionLoading, handleAccept, handleReject } = useBidActions();
  const { withdrawLoading, handleWithdraw } = useWithdrawBid();
  const { removeLoading, handleRemove } = useRemoveBid();

  // ── Active bids based on tab ─────────────────────────────────────────────
  const activeBids = activeTab === "received" ? receivedBids : placedBids;

  // ── Derived data (filter → search → sort pipeline) ───────────────────────
  const stats = useMemo(() => computeBidStats(activeBids), [activeBids]);

  const filteredBids = useMemo(() => {
    const byStatus = filterBidsByStatus(activeBids, statusFilter);
    const bySearch = searchBids(byStatus, search);
    return sortBids(bySearch, sortBy);
  }, [activeBids, statusFilter, search, sortBy]);

  const totalPages = Math.ceil(filteredBids.length / BIDS_PER_PAGE);
  const paginatedBids = filteredBids.slice(
    (currentPage - 1) * BIDS_PER_PAGE,
    currentPage * BIDS_PER_PAGE,
  );

  // ── Reset filters on tab / filter change ─────────────────────────────────
  const handleTabChange = useCallback((tab: MyBidsTab) => {
    setActiveTab(tab);
    setStatusFilter("all");
    setSearch("");
    setSortBy("newest");
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((status: BidStatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const onRejectConfirm = useCallback(
    (reason?: string) => {
      if (rejectModalBidId !== null) {
        handleReject(rejectModalBidId, reason);
        setRejectModalBidId(null);
      }
    },
    [rejectModalBidId, handleReject],
  );

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
        <div className="max-w-300 mx-auto">
          <div className="bg-[#141417] border border-white/4 rounded-xl p-10 text-center">
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
              Failed to load bids. Please refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-300 mx-auto">
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
              My Bids
            </h1>
            <p className="text-sm text-[#8e8e9a] mt-1">
              Track your placed bids and manage received offers.
            </p>
          </div>
        </div>

        {/* ─── Page Tabs (only for sellers: placed tab hidden) ────────── */}
        {isSeller && (
          <div className="flex items-center gap-1 mb-6">
            {BIDS_PAGE_TABS.filter((tab) => tab.key !== "placed").map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#e63946] text-white"
                    : "text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/4"
                }`}
              >
                {tab.label}
                <span className="ml-2 text-[11px] opacity-70">
                  {receivedBids.length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ─── Stats Bar ──────────────────────────────────────────────── */}
        <BidsStatsBar stats={stats} />

        {/* ─── Toolbar + Table ────────────────────────────────────────── */}
        <div className="bg-[#141417] border border-white/4 rounded-xl mb-5">
          <BidsToolbar
            statusFilter={statusFilter}
            onStatusFilterChange={handleFilterChange}
            search={search}
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            stats={stats}
          />

          {paginatedBids.length === 0 ? (
            <BidsEmptyState
              hasFilters={search !== "" || statusFilter !== "all"}
              tab={activeTab}
            />
          ) : (
            <div>
              {/* Table header */}
              {activeTab === "received" ? (
                <div className="grid grid-cols-[1fr_140px_100px_100px_90px_100px] gap-3 px-5 py-2.5 border-b border-white/2 text-[11px] text-[#8e8e9a]/60 uppercase tracking-wider font-semibold">
                  <span>Vehicle</span>
                  <span>Buyer</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_100px_100px_90px_100px] gap-3 px-5 py-2.5 border-b border-white/2 text-[11px] text-[#8e8e9a]/60 uppercase tracking-wider font-semibold">
                  <span>Vehicle</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
              )}

              {/* Table rows */}
              {paginatedBids.map((bid) =>
                activeTab === "received" ? (
                  <ReceivedBidRow
                    key={bid.id}
                    bid={bid}
                    isLoading={actionLoading === bid.id}
                    onAccept={() => handleAccept(bid.id)}
                    onReject={() => setRejectModalBidId(bid.id)}
                  />
                ) : (
                  <PlacedBidRow
                    key={bid.id}
                    bid={bid}
                    isLoading={withdrawLoading === bid.id || removeLoading === bid.id}
                    onWithdraw={() => handleWithdraw(bid.id)}
                    onRemove={() => handleRemove(bid.id)}
                  />
                ),
              )}
            </div>
          )}

          {/* ─── Pagination ─────────────────────────────────────────── */}
          <BidsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBids.length}
            perPage={BIDS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* ─── Reject Modal ─────────────────────────────────────────── */}
        {rejectModalBidId !== null && (
          <RejectBidModal
            onConfirm={onRejectConfirm}
            onCancel={() => setRejectModalBidId(null)}
          />
        )}
      </div>
    </div>
  );
}
