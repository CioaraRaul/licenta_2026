import type { BidsPaginationProps } from "~/interface/bid.interface";
import { BIDS_PER_PAGE } from "~/constants/bids.constants";

// ─── BidsPagination ───────────────────────────────────────────────────────────

export default function BidsPagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: BidsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
      <span className="text-[12px] text-[#8e8e9a]">
        Showing {(currentPage - 1) * perPage + 1}–
        {Math.min(currentPage * perPage, totalItems)} of {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1 rounded-md text-[12px] text-[#8e8e9a] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-md text-[12px] font-medium transition-colors ${
              currentPage === page
                ? "bg-[#e63946] text-white"
                : "text-[#8e8e9a] hover:bg-white/[0.04]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 rounded-md text-[12px] text-[#8e8e9a] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
