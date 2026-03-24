import type { JSX } from "react";
import { Link } from "react-router";
import { useAuthStore } from "~/store/auth.store";

const sellerStats = [
  {
    label: "Active Listings",
    value: "12",
    change: "+2 this week",
    up: true,
    icon: (
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
    ),
  },
  {
    label: "Total Views",
    value: "2,847",
    change: "+18% vs last month",
    up: true,
    icon: (
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
    ),
  },
  {
    label: "Bids Received",
    value: "34",
    change: "+5 this week",
    up: true,
    icon: (
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
    ),
  },
  {
    label: "Revenue",
    value: "$48,200",
    change: "+$12,400 this month",
    up: true,
    icon: (
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
    ),
  },
];

const sellerListings = [
  {
    name: "2024 BMW M4 Competition",
    price: "$78,500",
    views: 342,
    bids: 8,
    status: "active",
  },
  {
    name: "2023 Mercedes-AMG GT",
    price: "$92,800",
    views: 218,
    bids: 5,
    status: "active",
  },
  {
    name: "2022 Audi RS6 Avant",
    price: "$115,000",
    views: 567,
    bids: 12,
    status: "pending",
  },
  {
    name: "2023 Porsche Taycan",
    price: "$89,400",
    views: 891,
    bids: 0,
    status: "sold",
  },
];

// ——— Buyer mock data ———
const buyerStats = [
  {
    label: "Active Bids",
    value: "5",
    change: "2 ending soon",
    up: false,
    icon: (
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
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    label: "Saved Vehicles",
    value: "18",
    change: "+3 this week",
    up: true,
    icon: (
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
    ),
  },
  {
    label: "Vehicles Viewed",
    value: "124",
    change: "Past 30 days",
    up: true,
    icon: (
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
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Budget Set",
    value: "$95,000",
    change: "Max bid limit",
    up: false,
    icon: (
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
    ),
  },
];

const recentlyViewed = [
  {
    name: "2024 Porsche 911 Turbo",
    price: "$165,200",
    miles: "3,100",
    img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=300&h=200&fit=crop",
  },
  {
    name: "2024 BMW M4 Competition",
    price: "$78,500",
    miles: "8,200",
    img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&h=200&fit=crop",
  },
  {
    name: "2023 Mercedes-AMG GT",
    price: "$92,800",
    miles: "12,400",
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop",
  },
  {
    name: "2023 Audi RS e-tron GT",
    price: "$118,400",
    miles: "15,600",
    img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop",
  },
];

const recentActivity = [
  {
    action: "New bid received",
    detail: "BMW M4 Competition — $76,000",
    time: "2 min ago",
    type: "bid",
  },
  {
    action: "Listing viewed",
    detail: "Mercedes-AMG GT — 12 new views",
    time: "15 min ago",
    type: "view",
  },
  {
    action: "Message received",
    detail: "John D. about Porsche 911",
    time: "1 hour ago",
    type: "message",
  },
  {
    action: "Bid accepted",
    detail: "Audi RS6 Avant — $112,500",
    time: "3 hours ago",
    type: "success",
  },
  {
    action: "Price alert",
    detail: "Porsche Taycan dropped to $85,000",
    time: "5 hours ago",
    type: "alert",
  },
];

const activityIcons: Record<string, JSX.Element> = {
  bid: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e63946"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  view: (
    <svg
      width="14"
      height="14"
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
  ),
  message: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8b5cf6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  success: (
    <svg
      width="14"
      height="14"
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
  ),
  alert: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const activityColors: Record<string, string> = {
  bid: "rgba(230,57,70,0.12)",
  view: "rgba(59,130,246,0.12)",
  message: "rgba(139,92,246,0.12)",
  success: "rgba(16,185,129,0.12)",
  alert: "rgba(245,158,11,0.12)",
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const isSeller = user?.role === "seller" || user?.role === "admin";
  const stats = isSeller ? sellerStats : buyerStats;

  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
            Welcome back, {user?.username || "there"}
          </h1>
          <p className="text-sm text-[#8e8e9a] mt-1">
            {isSeller
              ? "Here's an overview of your listings and activity."
              : "Here's what's happening with your vehicle search."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#141417] border border-white/[0.04] rounded-xl p-4 hover:border-white/[0.08] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {stat.icon}
                </div>
                {stat.up && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                )}
              </div>
              <div className="text-[22px] font-bold text-[#f5f5f7] tracking-tight">
                {stat.value}
              </div>
              <div className="text-[12px] text-[#8e8e9a] mt-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#8e8e9a]/60 mt-1">
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* Seller: Listings table / Buyer: Recently Viewed */}
            {isSeller ? (
              <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                  <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                    My Listings
                  </h2>
                  <button className="text-[12px] text-[#e63946] font-medium hover:underline">
                    View all →
                  </button>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-[1fr_100px_70px_60px_80px] gap-3 px-5 py-2.5 border-b border-white/[0.02] text-[11px] text-[#8e8e9a]/60 uppercase tracking-wider font-semibold">
                  <span>Vehicle</span>
                  <span>Price</span>
                  <span>Views</span>
                  <span>Bids</span>
                  <span>Status</span>
                </div>

                {/* Table rows */}
                {sellerListings.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_100px_70px_60px_80px] gap-3 px-5 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors items-center cursor-pointer"
                  >
                    <span className="text-[13px] font-medium text-[#e8e8ed] truncate">
                      {item.name}
                    </span>
                    <span className="text-[13px] font-semibold text-[#f5f5f7]">
                      {item.price}
                    </span>
                    <span className="text-[12px] text-[#8e8e9a]">
                      {item.views}
                    </span>
                    <span className="text-[12px] text-[#8e8e9a]">
                      {item.bids}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-center ${
                        item.status === "active"
                          ? "bg-[rgba(16,185,129,0.12)] text-[#10b981]"
                          : item.status === "pending"
                            ? "bg-[rgba(245,158,11,0.12)] text-[#f59e0b]"
                            : "bg-white/[0.06] text-[#8e8e9a]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                  <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                    Recently Viewed
                  </h2>
                  <button className="text-[12px] text-[#e63946] font-medium hover:underline">
                    View all →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4">
                  {recentlyViewed.map((v, i) => (
                    <div
                      key={i}
                      className="group rounded-xl border border-white/[0.04] overflow-hidden hover:border-white/[0.08] cursor-pointer transition-all"
                    >
                      <div className="h-[120px] bg-[#0c0c0e] overflow-hidden">
                        <img
                          src={v.img}
                          alt={v.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-[13px] font-semibold text-[#e8e8ed] truncate mb-0.5">
                          {v.name}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-bold text-[#f5f5f7]">
                            {v.price}
                          </span>
                          <span className="text-[11px] text-[#8e8e9a]">
                            {v.miles} mi
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews / Ratings preview */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                  {isSeller ? "Seller Rating" : "Your Reviews"}
                </h2>
                <button className="text-[12px] text-[#e63946] font-medium hover:underline">
                  View all →
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-[36px] font-bold text-[#f5f5f7] leading-none">
                    4.8
                  </div>
                  <div className="flex items-center gap-0.5 mt-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={star <= 4 ? "#f59e0b" : "none"}
                        stroke="#f59e0b"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-[11px] text-[#8e8e9a] mt-1">
                    128 reviews
                  </div>
                </div>
                <div className="flex-1 space-y-1.5 pl-4 border-l border-white/[0.04]">
                  {[
                    { stars: 5, pct: 72 },
                    { stars: 4, pct: 18 },
                    { stars: 3, pct: 6 },
                    { stars: 2, pct: 3 },
                    { stars: 1, pct: 1 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2">
                      <span className="text-[11px] text-[#8e8e9a] w-3">
                        {row.stars}
                      </span>
                      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#f59e0b] rounded-full transition-all"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#8e8e9a]/60 w-7 text-right">
                        {row.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Activity Feed */}
          <div className="space-y-5">
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.04]">
                <h2 className="text-[15px] font-semibold text-[#f5f5f7]">
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-white/[0.02]">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: activityColors[item.type] }}
                    >
                      {activityIcons[item.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-medium text-[#e8e8ed]">
                        {item.action}
                      </div>
                      <div className="text-[11px] text-[#8e8e9a] truncate">
                        {item.detail}
                      </div>
                      <div className="text-[10px] text-[#8e8e9a]/50 mt-0.5">
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-white/[0.04]">
                <button className="text-[12px] text-[#e63946] font-medium hover:underline w-full text-center">
                  View all activity →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
              <h2 className="text-[15px] font-semibold text-[#f5f5f7] mb-3">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-2">
                {isSeller ? (
                  <>
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
                    <button className="w-full py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#bbbbc6] text-[13px] font-medium hover:bg-white/[0.06] transition-all">
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full py-2.5 bg-[#e63946] rounded-lg text-white text-[13px] font-semibold hover:shadow-[0_4px_12px_rgba(230,57,70,0.3)] transition-all flex items-center justify-center gap-2">
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
                    </button>
                    <button className="w-full py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#bbbbc6] text-[13px] font-medium hover:bg-white/[0.06] transition-all">
                      View Saved
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
