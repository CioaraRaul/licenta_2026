import { useState } from "react";
import { Link } from "react-router";
import type {
  SellerStats,
  BuyerStats,
  DashboardMainProps,
} from "~/interface/dashboard.interface";
import {
  formatCurrency,
  formatCurrencyFull,
} from "~/utils/format.utils";
import { getVehicleStatusBadge } from "~/utils/vehicle.utils";
import BuyerDashboard from "./buyerDashboard";

export default function DashboardMainComponent({
  stats,
  isSeller,
  user,
  listings,
  savedVehicles,
  recentBids,
  wallet,
  error,
}: DashboardMainProps) {
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>(
    {},
  );
  const toggleCard = (key: string) =>
    setCollapsedCards((prev) => ({ ...prev, [key]: !prev[key] }));

  if (error || !stats) {
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
              Failed to load dashboard. Please refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Buyer dashboard ──────────────────────────────────────────────────────
  if (!isSeller) {
    return (
      <BuyerDashboard
        stats={stats as BuyerStats}
        user={user}
        savedVehicles={savedVehicles}
        recentBids={recentBids}
        wallet={wallet}
      />
    );
  }

  // ─── Seller dashboard ────────────────────────────────────────────────────
  const sellerStats = stats as SellerStats;

  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
            Welcome back, {user?.username || "there"}
          </h1>
          <p className="text-sm text-[#8e8e9a] mt-1">
            Here's an overview of your listings and activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Active Listings */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.listings ? "mb-0" : "mb-3"}`}
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e63946"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => toggleCard("listings")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.listings ? "Expand" : "Collapse"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${collapsedCards.listings ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.listings ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {sellerStats.listings.active}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Active Listings
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  {sellerStats.listings.total} total
                </div>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.views ? "mb-0" : "mb-3"}`}
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => toggleCard("views")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.views ? "Expand" : "Collapse"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${collapsedCards.views ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.views ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {(sellerStats.views.total ?? 0).toLocaleString()}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Total Views
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  {sellerStats.bids.total} bids received
                </div>
              </div>
            </div>
          </div>

          {/* Cars Sold */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.sold ? "mb-0" : "mb-3"}`}
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => toggleCard("sold")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.sold ? "Expand" : "Collapse"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${collapsedCards.sold ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.sold ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {sellerStats.listings.sold}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Cars Sold
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  {sellerStats.bids.pending} pending bids
                </div>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.revenue ? "mb-0" : "mb-3"}`}
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => toggleCard("revenue")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.revenue ? "Expand" : "Collapse"}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${collapsedCards.revenue ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.revenue ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {formatCurrency(sellerStats.revenue.total)}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Total Revenue
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  {formatCurrency(sellerStats.revenue.total)} pending
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* Recent Listings */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                  Recent Listings
                </h2>
                <Link
                  to="/my-listings"
                  className="text-[12px] text-[#e63946] font-medium hover:underline no-underline"
                >
                  View all →
                </Link>
              </div>

              {(listings ?? []).length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-[#8e8e9a]">No listings yet.</p>
                  <Link
                    to="/my-listings/new"
                    className="text-[13px] text-[#e63946] font-medium hover:underline no-underline mt-2 inline-block"
                  >
                    Create your first listing →
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[1fr_100px_70px_85px] gap-3 px-5 py-2.5 border-b border-white/[0.02] text-[11px] text-[#8e8e9a]/60 uppercase tracking-wider font-semibold">
                    <span>Vehicle</span>
                    <span>Price</span>
                    <span>Views</span>
                    <span>Status</span>
                  </div>
                  {(listings ?? []).map((vehicle) => {
                    const badge = getVehicleStatusBadge(
                      vehicle.status,
                      vehicle.isActive,
                    );
                    return (
                      <div
                        key={vehicle.id}
                        className="grid grid-cols-[1fr_100px_70px_85px] gap-3 px-5 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors items-center cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {vehicle.images?.[0] ? (
                            <img
                              src={vehicle.images[0]}
                              alt=""
                              className="w-10 h-7 rounded object-cover shrink-0 bg-white/[0.04]"
                            />
                          ) : (
                            <div className="w-10 h-7 rounded bg-white/[0.04] shrink-0" />
                          )}
                          <span className="text-[13px] font-medium text-[#e8e8ed] truncate">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-[#f5f5f7]">
                          {formatCurrencyFull(vehicle.price)}
                        </span>
                        <span className="text-[12px] text-[#8e8e9a]">
                          {vehicle.viewsCount}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-center ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Seller Rating */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                  Seller Rating
                </h2>
                <span className="text-[12px] text-[#8e8e9a]">0 reviews</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-[36px] font-bold text-[#f5f5f7] leading-none">
                    {(0).toFixed(1)}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-[11px] text-[#8e8e9a] mt-1">
                    0 reviews
                  </div>
                </div>
                <div className="flex-1 pl-4 border-l border-white/[0.04] space-y-2">
                  {[
                    {
                      label: "Cars sold",
                      value: `${sellerStats.listings.sold}`,
                      cls: "text-[#e8e8ed]",
                    },
                    {
                      label: "Pending bids",
                      value: `${sellerStats.bids.pending}`,
                      cls: "text-[#f59e0b]",
                    },
                    {
                      label: "Pending balance",
                      value: formatCurrency(sellerStats.revenue.total),
                      cls: "text-[#10b981]",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[12px] text-[#8e8e9a]">
                        {row.label}
                      </span>
                      <span
                        className={`text-[13px] font-semibold ${row.cls}`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Revenue Summary */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
              <h2 className="text-[15px] font-semibold text-[#f5f5f7] mb-3">
                Revenue Summary
              </h2>
              <div>
                {[
                  {
                    label: "Total earned",
                    value: formatCurrency(sellerStats.revenue.total),
                    cls: "text-[#10b981]",
                  },
                  {
                    label: "Pending payout",
                    value: formatCurrency(sellerStats.revenue.total),
                    cls: "text-[#f59e0b]",
                  },
                  {
                    label: "Cars sold",
                    value: `${sellerStats.listings.sold}`,
                    cls: "text-[#f5f5f7]",
                  },
                ].map((row, index, arr) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center py-3 ${index < arr.length - 1 ? "border-b border-white/[0.03]" : ""}`}
                  >
                    <span className="text-[13px] text-[#8e8e9a]">
                      {row.label}
                    </span>
                    <span className={`text-[14px] font-bold ${row.cls}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
              <h2 className="text-[15px] font-semibold text-[#f5f5f7] mb-3">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-2">
                <Link
                  to="/my-listings/new"
                  className="w-full py-2.5 bg-[#e63946] rounded-lg text-white text-[13px] font-semibold hover:shadow-[0_4px_12px_rgba(230,57,70,0.3)] transition-all flex items-center justify-center gap-2 no-underline"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New Listing
                </Link>
                <Link
                  to="/my-listings"
                  className="w-full py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#bbbbc6] text-[13px] font-medium hover:bg-white/[0.06] transition-all text-center no-underline"
                >
                  Manage Listings
                </Link>
                <Link
                  to="/messages"
                  className="w-full py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#bbbbc6] text-[13px] font-medium hover:bg-white/[0.06] transition-all text-center no-underline"
                >
                  Messages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
