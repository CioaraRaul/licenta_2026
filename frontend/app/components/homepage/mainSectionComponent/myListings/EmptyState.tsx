import { Link } from "react-router";

// ─── Empty State ──────────────────────────────────────────────────────────────

export default function EmptyState({ hasFilters }: { hasFilters: boolean }) {
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
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
      {hasFilters ? (
        <>
          <p className="text-[#8e8e9a] text-sm font-medium">
            No listings match your filters
          </p>
          <p className="text-[#8e8e9a]/50 text-[12px] mt-1">
            Try adjusting your search or status filter.
          </p>
        </>
      ) : (
        <>
          <p className="text-[#8e8e9a] text-sm font-medium">
            You don't have any listings yet
          </p>
          <p className="text-[#8e8e9a]/50 text-[12px] mt-1">
            Create your first listing to start selling.
          </p>
          <Link
            to="/my-listings"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#e63946] hover:bg-[#d62b39] text-white text-[13px] font-semibold rounded-lg transition-colors no-underline"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Listing
          </Link>
        </>
      )}
    </div>
  );
}
