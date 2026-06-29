import { useState } from "react";
import { Link } from "react-router";
import type { PlacedBidRowProps } from "~/interface/bid.interface";
import {
  getBidVehicleTitle,
  getBidVehicleThumbnail,
  getBidStatusBadge,
} from "~/utils/bids.utils";
import { formatCurrencyFull, formatRelativeTime } from "~/utils/format.utils";
import DeleteBidModal from "./DeleteBidModal";

const REMOVABLE_STATUSES = new Set(["pending"]);

// ─── PlacedBidRow ─────────────────────────────────────────────────────────────

export default function PlacedBidRow({
  bid,
  isLoading,
  onWithdraw,
  onRemove,
}: PlacedBidRowProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const badge = getBidStatusBadge(bid.status);
  const thumbnail = getBidVehicleThumbnail(bid.vehicle);
  const title = getBidVehicleTitle(bid.vehicle);
  const canDelete = REMOVABLE_STATUSES.has(bid.status);

  return (
    <>
      <div
        className={`group relative grid grid-cols-[1fr_100px_100px_90px_100px] gap-3 px-5 py-3 border-b border-white/2 last:border-0 hover:bg-white/2 transition-colors items-center ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Vehicle info */}
        <Link
          to={`/find-vehicle/${bid.vehicleId}`}
          className="flex items-center gap-3 min-w-0 group/link"
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-12 h-8 rounded object-cover shrink-0 bg-white/4"
            />
          ) : (
            <div className="w-12 h-8 rounded bg-white/4 shrink-0 flex items-center justify-center">
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
            <div className="text-[13px] font-medium text-[#f5f5f7] truncate group-hover/link:text-[#e63946] transition-colors">
              {title}
            </div>
            {bid.message && (
              <div className="text-[11px] text-[#8e8e9a]/60 mt-0.5 truncate max-w-45">
                "{bid.message}"
              </div>
            )}
            {bid.rejectionReason && bid.status === "rejected" && (
              <div className="text-[11px] text-[#f87171]/60 mt-0.5 truncate max-w-55">
                Reason: {bid.rejectionReason}
              </div>
            )}
          </div>
        </Link>

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
              type="button"
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

        {/* X delete icon — visible on row hover, only for removable statuses */}
        {canDelete && (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            title="Delete bid"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-[#e63946] bg-[#e63946]/10 hover:bg-[#e63946]/25 transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {showConfirm && (
        <DeleteBidModal
          onConfirm={() => {
            setShowConfirm(false);
            onRemove();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
