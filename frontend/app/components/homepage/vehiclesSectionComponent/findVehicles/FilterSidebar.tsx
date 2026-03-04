import { useState, useRef, useEffect } from "react";
import type {
  FilterSidebarProps,
  FilterVehicleParams,
} from "~/interface/vehicle.interface";
import {
  VEHICLE_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
} from "~/constants/findVehicle.constants";
import { countActiveFilters } from "~/utils/findVehicle.utils";
import { SearchIcon, CloseIcon } from "./FindVehicleIcons";
import { FilterSection, FilterSelect, RangeInputs } from "./FilterPrimitives";

/* ── Main sidebar ────────────────────────────────────────────────────────── */

export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onClose,
  totalResults,
}: FilterSidebarProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  const update = (patch: Partial<FilterVehicleParams>) => {
    onFilterChange({ ...filters, ...patch, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      update({ search: value || undefined });
    }, 400);
  };

  const activeCount = countActiveFilters(filters);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-[#141417] border-r border-white/6 z-50
          transform transition-transform duration-200 lg:relative lg:transform-none lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col shrink-0 overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#f5f5f7]">
              Filters
            </span>
            {activeCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#e63946] text-[10px] font-bold text-white flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-[11px] text-[#e63946] hover:text-[#ff4d5a] transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded hover:bg-white/6 transition-colors text-[#8e8e9a]"
              title="Close filters"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Scrollable filters */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          {/* Search */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search make, model..."
                className="w-full bg-[#1c1c20] border border-white/6 rounded-lg pl-9 pr-3 py-2 text-[12px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-white/12 transition-colors"
              />
            </div>
          </div>

          {/* Vehicle Type */}
          <FilterSection title="Vehicle Type">
            <FilterSelect
              value={filters.type ?? ""}
              onChange={(v) =>
                update({
                  type: (v as FilterVehicleParams["type"]) || undefined,
                })
              }
              placeholder="All Types"
              options={VEHICLE_TYPE_OPTIONS}
              label="Vehicle type"
            />
          </FilterSection>

          {/* Condition */}
          <FilterSection title="Condition">
            <FilterSelect
              value={filters.condition ?? ""}
              onChange={(v) =>
                update({
                  condition:
                    (v as FilterVehicleParams["condition"]) || undefined,
                })
              }
              placeholder="Any Condition"
              options={CONDITION_OPTIONS}
              label="Condition"
            />
          </FilterSection>

          {/* Make & Model */}
          <FilterSection title="Make & Model">
            <input
              type="text"
              title="Make"
              value={filters.make ?? ""}
              onChange={(e) => update({ make: e.target.value || undefined })}
              placeholder="Make (e.g. BMW)"
              className="w-full bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-2 text-[12px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-white/12 transition-colors"
            />
            <input
              type="text"
              title="Model"
              value={filters.model ?? ""}
              onChange={(e) => update({ model: e.target.value || undefined })}
              placeholder="Model (e.g. M4)"
              className="w-full bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-2 text-[12px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-white/12 transition-colors"
            />
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <RangeInputs
              fromValue={filters.priceFrom?.toString() ?? ""}
              toValue={filters.priceTo?.toString() ?? ""}
              onFromChange={(v) =>
                update({ priceFrom: v ? Number(v) : undefined })
              }
              onToChange={(v) => update({ priceTo: v ? Number(v) : undefined })}
              fromPlaceholder="Min $"
              toPlaceholder="Max $"
              fromLabel="Minimum price"
              toLabel="Maximum price"
            />
          </FilterSection>

          {/* Year Range */}
          <FilterSection title="Year" defaultOpen={false}>
            <RangeInputs
              fromValue={filters.yearFrom?.toString() ?? ""}
              toValue={filters.yearTo?.toString() ?? ""}
              onFromChange={(v) =>
                update({ yearFrom: v ? Number(v) : undefined })
              }
              onToChange={(v) => update({ yearTo: v ? Number(v) : undefined })}
              fromPlaceholder="From"
              toPlaceholder="To"
              fromLabel="Year from"
              toLabel="Year to"
            />
          </FilterSection>

          {/* Mileage Range */}
          <FilterSection title="Mileage" defaultOpen={false}>
            <RangeInputs
              fromValue={filters.mileageFrom?.toString() ?? ""}
              toValue={filters.mileageTo?.toString() ?? ""}
              onFromChange={(v) =>
                update({ mileageFrom: v ? Number(v) : undefined })
              }
              onToChange={(v) =>
                update({ mileageTo: v ? Number(v) : undefined })
              }
              fromPlaceholder="Min mi"
              toPlaceholder="Max mi"
              fromLabel="Minimum mileage"
              toLabel="Maximum mileage"
            />
          </FilterSection>

          {/* Fuel Type */}
          <FilterSection title="Fuel Type" defaultOpen={false}>
            <FilterSelect
              value={filters.fuelType ?? ""}
              onChange={(v) =>
                update({
                  fuelType: (v as FilterVehicleParams["fuelType"]) || undefined,
                })
              }
              placeholder="Any Fuel"
              options={FUEL_TYPE_OPTIONS}
              label="Fuel type"
            />
          </FilterSection>

          {/* Transmission */}
          <FilterSection title="Transmission" defaultOpen={false}>
            <FilterSelect
              value={filters.transmission ?? ""}
              onChange={(v) =>
                update({
                  transmission:
                    (v as FilterVehicleParams["transmission"]) || undefined,
                })
              }
              placeholder="Any Transmission"
              options={TRANSMISSION_OPTIONS}
              label="Transmission"
            />
          </FilterSection>

          {/* Exterior Color */}
          <FilterSection title="Exterior Color" defaultOpen={false}>
            <FilterSelect
              value={filters.exteriorColor ?? ""}
              onChange={(v) => update({ exteriorColor: v || undefined })}
              placeholder="Any Color"
              options={EXTERIOR_COLOR_OPTIONS}
              label="Exterior color"
            />
          </FilterSection>

          {/* Location */}
          <FilterSection title="Location" defaultOpen={false}>
            <input
              type="text"
              title="City"
              value={filters.city ?? ""}
              onChange={(e) => update({ city: e.target.value || undefined })}
              placeholder="City"
              className="w-full bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-2 text-[12px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-white/12 transition-colors"
            />
            <input
              type="text"
              title="Country"
              value={filters.country ?? ""}
              onChange={(e) => update({ country: e.target.value || undefined })}
              placeholder="Country"
              className="w-full bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-2 text-[12px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-white/12 transition-colors"
            />
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/6">
          <p className="text-[11px] text-[#8e8e9a] text-center">
            {totalResults.toLocaleString()} vehicle
            {totalResults !== 1 ? "s" : ""} found
          </p>
        </div>
      </aside>
    </>
  );
}
