import type { FindVehiclePaginationProps } from "~/interface/vehicle.interface";
import { getPageNumbers } from "~/utils/findVehicle.utils";
import { ChevronLeftIcon, ChevronRightIcon } from "./FindVehicleIcons";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: FindVehiclePaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg border border-white/6 text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/6 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Previous page"
      >
        <ChevronLeftIcon />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-8 h-8 flex items-center justify-center text-[12px] text-[#555]"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-colors ${
              p === currentPage
                ? "bg-[#e63946] text-white"
                : "text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/6 border border-white/6"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg border border-white/6 text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/6 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Next page"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
