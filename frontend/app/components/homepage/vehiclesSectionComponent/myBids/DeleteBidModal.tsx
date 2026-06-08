// ─── DeleteBidModal ───────────────────────────────────────────────────────────

interface DeleteBidModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteBidModal({
  onConfirm,
  onCancel,
}: DeleteBidModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[380px] mx-4 bg-[#1a1a1e] border border-white/[0.08] rounded-xl shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center pt-6 pb-2">
          <div className="w-11 h-11 rounded-full bg-[#e63946]/10 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e63946"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-0 text-center">
          <h3 className="text-[16px] font-semibold text-[#f5f5f7]">
            Delete this bid?
          </h3>
          <p className="text-[13px] text-[#8e8e9a] mt-1.5 leading-relaxed">
            This will permanently remove the bid from your history. This action
            cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#e63946] hover:bg-[#d62b39] text-white transition-colors"
          >
            Yes, delete it
          </button>
        </div>
      </div>
    </div>
  );
}
