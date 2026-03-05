import type { ActiveFiltersProps } from "~/interface/vehicle.interface";
import { FILTER_LABELS } from "~/constants/findVehicle.constants";
import {
  formatFilterValue,
  getActiveFilterEntries,
} from "~/utils/findVehicle.utils";
import { CloseIcon } from "./FindVehicleIcons";

export default function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const entries = getActiveFilterEntries(filters);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {entries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/6 text-[11px] text-[#c5c5d0] border border-white/6"
        >
          <span className="text-[#8e8e9a]">{FILTER_LABELS[key] ?? key}:</span>
          <span className="text-[#f5f5f7]">
            {formatFilterValue(key, value)}
          </span>
          <button
            onClick={() => onRemoveFilter(key)}
            className="ml-0.5 hover:text-[#e63946] transition-colors"
            title={`Remove ${FILTER_LABELS[key] ?? key} filter`}
          >
            <CloseIcon />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-[11px] text-[#e63946] hover:text-[#ff4d5a] transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
