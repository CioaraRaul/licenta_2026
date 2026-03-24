import type { PlacedBidRowProps } from "~/interface/bid.interface";
import {
  getBidVehicleTitle,
  getBidVehicleThumbnail,
  getBidStatusBadge,
} from "~/utils/bids.utils";
import { formatCurrencyFull, formatRelativeTime } from "~/utils/format.utils";

// ─── PlacedBidRow ─────────────────────────────────────────────────────────────

export default function PlacedBidRow({
  bid,
  isLoading,
  onWithdraw,
}: PlacedBidRowProps) {
  const badge = getBidStatusBadge(bid.status);
  const thumbnail = getBidVehicleThumbnail(bid.vehicle);
  const title = getBidVehicleTitle(bid.vehicle);

  return (
    <div
      className={`grid grid-cols-[1fr_100px_100px_90px_100px] gap-3 px-5 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors items-center ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Vehicle info */}
      <div className="flex items-center gap-3 min-w-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-12 h-8 rounded object-cover shrink-0 bg-white/[0.04]"
          />
        ) : (
          <div className="w-12 h-8 rounded bg-white/[0.04] shrink-0 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8e8e9a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-[#f5f5f7] truncate">
            {title}
          </div>
          {bid.message && (
            <div className="text-[11px] text-[#8e8e9a]/60 mt-0.5 truncate max-w-[180px]">
              "{bid.message}"
            </div>
          )}
          {bid.rejectionReason && bid.status === "rejected" && (
            <div className="text-[11px] text-[#f87171]/60 mt-0.5 truncate max-w-[220px]">
              Reason: {bid.rejectionReason}
            </div>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="text-[13px] font-semibold text-[#f5f5f7]">
        {formatCurrencyFull(Number(bid.amount))}
      </div>

      {/* Date */}
      <div className="text-[12px] text-[#8e8e9a]">
        {formatRelativeTime(bid.createdAt)}
      </div>

      {/* Status badge */}
      <div>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {bid.status === "pending" ? (
          <button
            onClick={onWithdraw}
            title="Withdraw bid"
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#8b5cf6]/15 text-[#8b5cf6] hover:bg-[#8b5cf6]/25 transition-colors"
          >
            Withdraw
          </button>
        ) : (
          <span className="text-[11px] text-[#8e8e9a]/40">—</span>
        )}
      </div>
    </div>
  );
}
