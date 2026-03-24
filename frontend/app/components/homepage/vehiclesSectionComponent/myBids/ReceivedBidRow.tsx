import type { ReceivedBidRowProps } from "~/interface/bid.interface";
import {
  getBidVehicleTitle,
  getBidVehicleThumbnail,
  getBidStatusBadge,
} from "~/utils/bids.utils";
import { formatCurrencyFull, formatRelativeTime } from "~/utils/format.utils";
import { getAvatarColor, getAvatarInitials } from "~/utils/avatar.utils";

// ─── ReceivedBidRow ───────────────────────────────────────────────────────────

export default function ReceivedBidRow({
  bid,
  isLoading,
  onAccept,
  onReject,
}: ReceivedBidRowProps) {
  const badge = getBidStatusBadge(bid.status);
  const thumbnail = getBidVehicleThumbnail(bid.vehicle);
  const title = getBidVehicleTitle(bid.vehicle);
  const buyerName = bid.buyer
    ? `${bid.buyer.firstName ?? ""} ${bid.buyer.lastName ?? ""}`.trim() ||
      bid.buyer.username
    : "Unknown";

  return (
    <div
      className={`grid grid-cols-[1fr_140px_100px_100px_90px_100px] gap-3 px-5 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors items-center ${
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
        </div>
      </div>

      {/* Buyer info */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
          style={{ backgroundColor: getAvatarColor(buyerName) }}
        >
          {getAvatarInitials(buyerName)}
        </div>
        <span className="text-[12px] text-[#e8e8ed] truncate">{buyerName}</span>
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
          <>
            <button
              onClick={onAccept}
              title="Accept bid"
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/25 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={onReject}
              title="Reject bid"
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#f87171]/15 text-[#f87171] hover:bg-[#f87171]/25 transition-colors"
            >
              Reject
            </button>
          </>
        ) : (
          <span className="text-[11px] text-[#8e8e9a]/40">—</span>
        )}
      </div>
    </div>
  );
}
