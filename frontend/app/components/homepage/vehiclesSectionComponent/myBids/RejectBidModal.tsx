import { useState } from "react";
import type { RejectBidModalProps } from "~/interface/bid.interface";

// ─── RejectBidModal ───────────────────────────────────────────────────────────

export default function RejectBidModal({
  onConfirm,
  onCancel,
}: RejectBidModalProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[420px] mx-4 bg-[#1a1a1e] border border-white/[0.08] rounded-xl shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-0">
          <h3 className="text-[16px] font-semibold text-[#f5f5f7]">
            Reject Bid
          </h3>
          <p className="text-[13px] text-[#8e8e9a] mt-1">
            Optionally provide a reason for rejecting this bid. The buyer will
            be able to see this.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (optional)..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[13px] text-[#f5f5f7] placeholder-[#8e8e9a]/50 outline-none focus:border-white/[0.16] transition-colors resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 pb-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason.trim() || undefined)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#e63946] hover:bg-[#d62b39] text-white transition-colors"
          >
            Reject Bid
          </button>
        </div>
      </div>
    </div>
  );
}
