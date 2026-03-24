import type {
  BidsToolbarProps,
  BidSortOption,
} from "~/interface/bid.interface";
import { BID_STATUS_TABS, BID_SORT_OPTIONS } from "~/constants/bids.constants";

// ─── BidsToolbar ──────────────────────────────────────────────────────────────

export default function BidsToolbar({
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  stats,
}: BidsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-white/[0.04]">
      {/* Status tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {BID_STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const count =
            tab.key === "all"
              ? stats.total
              : stats[tab.key as keyof typeof stats];
          return (
            <button
              key={tab.key}
              onClick={() => onStatusFilterChange(tab.key)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-white/[0.08] text-[#f5f5f7]"
                  : "text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[11px] opacity-60">{count}</span>
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
            placeholder="Search bids..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-[180px] pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#f5f5f7] placeholder-[#8e8e9a]/50 outline-none focus:border-white/[0.12] transition-colors"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as BidSortOption)}
          className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#f5f5f7] outline-none cursor-pointer focus:border-white/[0.12] transition-colors appearance-none"
        >
          {BID_SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key} className="bg-[#1a1a1e]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
