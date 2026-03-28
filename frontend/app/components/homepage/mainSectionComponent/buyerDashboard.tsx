import { useState } from "react";
import { Link } from "react-router";
import type { BuyerDashboardProps } from "~/interface/dashboard.interface";
import {
  formatCurrency,
  formatCurrencyFull,
  formatMileage,
  formatRelativeTime,
} from "~/utils/format.utils";
import { getBidStatusBadge } from "~/utils/bids.utils";

export default function BuyerDashboard({
  stats,
  user,
  savedVehicles,
  recentBids,
  wallet,
}: BuyerDashboardProps) {
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>(
    {},
  );
  const toggleCard = (key: string) =>
    setCollapsedCards((prev) => ({ ...prev, [key]: !prev[key] }));

  const walletBalance = wallet?.balance ?? 0;
  const frozenBalance = wallet?.frozenBalance ?? 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
            Welcome back, {user?.username || "there"}
          </h1>
          <p className="text-sm text-[#8e8e9a] mt-1">
            Here's what's happening with your vehicle search.
          </p>
        </div>

        {/* ────── Stats Grid ────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Active Bids */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.bids ? "mb-0" : "mb-3"}`}
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
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <button
                onClick={() => toggleCard("bids")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.bids ? "Expand" : "Collapse"}
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
                  className={`transition-transform duration-200 ${collapsedCards.bids ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.bids ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {stats.bids.pending}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Active Bids
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  {stats.bids.accepted} accepted
                </div>
              </div>
            </div>
          </div>

          {/* Saved Vehicles */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.saved ? "mb-0" : "mb-3"}`}
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
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </div>
              <button
                onClick={() => toggleCard("saved")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.saved ? "Expand" : "Collapse"}
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
                  className={`transition-transform duration-200 ${collapsedCards.saved ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.saved ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {stats.saved.total}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Saved Vehicles
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  {stats.bids.total} total bids
                </div>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.spent ? "mb-0" : "mb-3"}`}
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
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <button
                onClick={() => toggleCard("spent")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.spent ? "Expand" : "Collapse"}
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
                  className={`transition-transform duration-200 ${collapsedCards.spent ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.spent ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {formatCurrency(stats.spent.total)}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Total Spent
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  all time
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${collapsedCards.wallet ? "mb-0" : "mb-3"}`}
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
                onClick={() => toggleCard("wallet")}
                className="w-7 h-7 rounded-md bg-white/[0.03] hover:bg-white/[0.07] flex items-center justify-center transition-all cursor-pointer"
                title={collapsedCards.wallet ? "Expand" : "Collapse"}
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
                  className={`transition-transform duration-200 ${collapsedCards.wallet ? "rotate-180" : ""}`}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ${collapsedCards.wallet ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden">
                <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                  {formatCurrency(walletBalance)}
                </div>
                <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                  Wallet Balance
                </div>
                <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                  {frozenBalance > 0
                    ? `${formatCurrency(frozenBalance)} frozen`
                    : "available funds"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ────── Main content area ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column — 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Recent Bids table */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                  Recent Bids
                </h2>
                <Link
                  to="/bids"
                  className="text-[12px] text-[#e63946] font-medium hover:underline no-underline"
                >
                  View all →
                </Link>
              </div>

              {recentBids.length === 0 ? (
                <div className="py-10 text-center">
                  <svg
                    className="mx-auto mb-3 opacity-30"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8e8e9a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  <p className="text-sm text-[#8e8e9a]">
                    No bids placed yet.
                  </p>
                  <Link
                    to="/find-vehicle"
                    className="text-[13px] text-[#e63946] font-medium hover:underline no-underline mt-2 inline-block"
                  >
                    Browse vehicles to place your first bid →
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[1fr_90px_80px_80px] gap-3 px-5 py-2.5 border-b border-white/[0.02] text-[11px] text-[#8e8e9a]/60 uppercase tracking-wider font-semibold">
                    <span>Vehicle</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span className="text-right">Date</span>
                  </div>
                  {recentBids.map((bid) => {
                    const badge = getBidStatusBadge(bid.status);
                    const vehicle = bid.vehicle;
                    return (
                      <Link
                        key={bid.id}
                        to="/bids"
                        className="grid grid-cols-[1fr_90px_80px_80px] gap-3 px-5 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors items-center cursor-pointer no-underline"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {vehicle?.images?.[0] ? (
                            <img
                              src={vehicle.images[0]}
                              alt=""
                              className="w-10 h-7 rounded object-cover flex-shrink-0 bg-white/[0.04]"
                            />
                          ) : (
                            <div className="w-10 h-7 rounded bg-white/[0.04] flex-shrink-0" />
                          )}
                          <span className="text-[13px] font-medium text-[#e8e8ed] truncate">
                            {vehicle
                              ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                              : "Unknown Vehicle"}
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-[#f5f5f7]">
                          {formatCurrencyFull(bid.amount)}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-center ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[12px] text-[#8e8e9a] text-right">
                          {formatRelativeTime(bid.createdAt)}
                        </span>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>

            {/* Recently Saved */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                  Recently Saved
                </h2>
                <Link
                  to="/saved"
                  className="text-[12px] text-[#e63946] font-medium hover:underline no-underline"
                >
                  View all →
                </Link>
              </div>
              {savedVehicles.length === 0 ? (
                <div className="py-10 text-center">
                  <svg
                    className="mx-auto mb-3 opacity-30"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8e8e9a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                  </svg>
                  <p className="text-sm text-[#8e8e9a]">
                    No saved vehicles yet.
                  </p>
                  <Link
                    to="/find-vehicle"
                    className="text-[13px] text-[#e63946] font-medium hover:underline no-underline mt-2 inline-block"
                  >
                    Browse vehicles →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-4">
                  {savedVehicles.slice(0, 4).map((saved) => {
                    const vehicle = saved.vehicle;
                    return (
                      <Link
                        key={saved.id}
                        to={`/find-vehicle/${vehicle.id}`}
                        className="group rounded-xl border border-white/[0.04] overflow-hidden hover:border-white/[0.08] cursor-pointer transition-all no-underline"
                      >
                        <div className="h-[120px] bg-[#0c0c0e] overflow-hidden">
                          {vehicle.images?.[0] ? (
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#8e8e9a"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.3"
                              >
                                <rect x="1" y="3" width="15" height="13" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="text-[13px] font-semibold text-[#e8e8ed] truncate mb-0.5">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-bold text-[#f5f5f7]">
                              {formatCurrencyFull(vehicle.price)}
                            </span>
                            <span className="text-[11px] text-[#8e8e9a]">
                              {formatMileage(vehicle.mileage)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column — 1/3 */}
          <div className="space-y-5">
            {/* Bid Activity breakdown */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
              <h2 className="text-[15px] font-semibold text-[#f5f5f7] mb-4">
                Bid Activity
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Total",
                    value: stats.bids.total,
                    cls: "text-[#e8e8ed]",
                  },
                  {
                    label: "Pending",
                    value: stats.bids.pending,
                    cls: "text-[#f59e0b]",
                  },
                  {
                    label: "Accepted",
                    value: stats.bids.accepted,
                    cls: "text-[#10b981]",
                  },
                  {
                    label: "Rejected",
                    value: stats.bids.rejected,
                    cls: "text-[#f87171]",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/[0.02] rounded-lg p-3 text-center border border-white/[0.04]"
                  >
                    <div className={`text-[20px] font-bold ${item.cls}`}>
                      {item.value}
                    </div>
                    <div className="text-[11px] text-[#8e8e9a] mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bid success rate */}
              {stats.bids.total > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#8e8e9a]">
                      Success Rate
                    </span>
                    <span className="text-[13px] font-semibold text-[#10b981]">
                      {Math.round(
                        (stats.bids.accepted / stats.bids.total) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10b981] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((stats.bids.accepted / stats.bids.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Spending Summary */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
              <h2 className="text-[15px] font-semibold text-[#f5f5f7] mb-3">
                Spending Summary
              </h2>
              <div>
                {[
                  {
                    label: "Total spent",
                    value: formatCurrency(stats.spent.total),
                    cls: "text-[#f5f5f7]",
                  },
                  {
                    label: "Wallet balance",
                    value: formatCurrency(walletBalance),
                    cls: "text-[#10b981]",
                  },
                  ...(frozenBalance > 0
                    ? [
                        {
                          label: "Frozen (in bids)",
                          value: formatCurrency(frozenBalance),
                          cls: "text-[#f59e0b]",
                        },
                      ]
                    : []),
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-white/[0.03]" : ""}`}
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
                  to="/find-vehicle"
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
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Find Vehicles
                </Link>
                <Link
                  to="/bids"
                  className="w-full py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#bbbbc6] text-[13px] font-medium hover:bg-white/[0.06] transition-all text-center no-underline"
                >
                  My Bids
                </Link>
                <Link
                  to="/saved"
                  className="w-full py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#bbbbc6] text-[13px] font-medium hover:bg-white/[0.06] transition-all text-center no-underline"
                >
                  View Saved
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
