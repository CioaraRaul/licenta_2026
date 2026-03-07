import type { BidsEmptyStateProps } from "~/interface/bid.interface";

// ─── BidsEmptyState ───────────────────────────────────────────────────────────

export default function BidsEmptyState({
  hasFilters,
  tab,
}: BidsEmptyStateProps) {
  return (
    <div className="px-5 py-16 text-center">
      <svg
        className="mx-auto mb-4 opacity-20"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8e8e9a"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
      {hasFilters ? (
        <>
          <p className="text-[#8e8e9a] text-sm font-medium">
            No bids match your filters
          </p>
          <p className="text-[#8e8e9a]/50 text-[12px] mt-1">
            Try adjusting your search or status filter.
          </p>
        </>
      ) : tab === "received" ? (
        <>
          <p className="text-[#8e8e9a] text-sm font-medium">
            No bids received yet
          </p>
          <p className="text-[#8e8e9a]/50 text-[12px] mt-1">
            When buyers place bids on your vehicles, they'll appear here.
          </p>
        </>
      ) : (
        <>
          <p className="text-[#8e8e9a] text-sm font-medium">
            You haven't placed any bids yet
          </p>
          <p className="text-[#8e8e9a]/50 text-[12px] mt-1">
            Browse vehicles and place bids to see them here.
          </p>
        </>
      )}
    </div>
  );
}
