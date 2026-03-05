import type { ResultsHeaderProps } from "~/interface/vehicle.interface";
import { SORT_OPTIONS } from "~/constants/findVehicle.constants";
import { GridIcon, ListIcon, FilterIcon } from "./FindVehicleIcons";

export default function ResultsHeader({
  total,
  sortBy,
  sortOrder,
  viewMode,
  onSortChange,
  onViewModeChange,
  onToggleSidebar,
}: ResultsHeaderProps) {
  const currentSort = `${sortBy}-${sortOrder}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      {/* Left — result count + mobile filter toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/6 text-[12px] text-[#f5f5f7] hover:bg-white/8 transition-colors"
          title="Toggle filters"
        >
          <FilterIcon /> Filters
        </button>
        <p className="text-[13px] text-[#8e8e9a]">
          <span className="text-[#f5f5f7] font-medium">
            {total.toLocaleString()}
          </span>{" "}
          vehicle{total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Right — sort + view toggle */}
      <div className="flex items-center gap-2">
        {/* Sort dropdown */}
        <select
          title="Sort vehicles"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-1.5 text-[12px] text-[#f5f5f7] outline-none cursor-pointer focus:border-white/12 transition-colors appearance-none pr-7"
        >
          {SORT_OPTIONS.map((o) => (
            <option
              key={o.value}
              value={o.value}
              className="bg-[#1c1c20] text-[#e0e0e5]"
            >
              {o.label}
            </option>
          ))}
        </select>

        {/* View mode toggle */}
        <div className="flex rounded-lg border border-white/6 overflow-hidden">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-white/8 text-[#f5f5f7]"
                : "text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/4"
            }`}
            title="Grid view"
          >
            <GridIcon />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 transition-colors ${
              viewMode === "list"
                ? "bg-white/8 text-[#f5f5f7]"
                : "text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/4"
            }`}
            title="List view"
          >
            <ListIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
