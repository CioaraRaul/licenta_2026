import { useState, useCallback, useEffect, useRef } from "react";
import type { CompareSearchModalProps } from "~/interface/compare.interface";
import type { Vehicle } from "~/interface/vehicle.interface";
import { getVehicles } from "~/api/vehicles.api";
import { getVehicleTitle } from "~/utils/compare.utils";
import { formatCurrencyFull, formatMileage } from "~/utils/format.utils";
import {
  XIcon,
  SearchIcon,
  SpinnerIcon,
  ImagePlaceholderIcon,
} from "./CompareIcons";

export default function CompareSearchModal({
  isOpen,
  onClose,
  onSelect,
  excludeIds,
}: CompareSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Load all vehicles when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setQuery("");
    setResults([]);
    setTimeout(() => inputRef.current?.focus(), 100);

    let cancelled = false;
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const res = await getVehicles({ limit: 50, page: 1 });
        if (!cancelled) {
          const filtered = res.data.filter((v) => !excludeIds.includes(v.id));
          setAllVehicles(filtered);
          setResults(filtered);
        }
      } catch {
        if (!cancelled) {
          setAllVehicles([]);
          setResults([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, excludeIds.join(",")]);

  // Debounced search — filters from preloaded list or does API search
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length === 0) {
        // Show all vehicles when query is cleared
        setResults(allVehicles);
        return;
      }

      if (value.trim().length < 2) {
        // For 1-char queries, do a quick local filter
        const q = value.trim().toLowerCase();
        setResults(
          allVehicles.filter(
            (v) =>
              v.make.toLowerCase().includes(q) ||
              v.model.toLowerCase().includes(q) ||
              `${v.year}`.includes(q),
          ),
        );
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const res = await getVehicles({
            search: value.trim(),
            limit: 20,
            page: 1,
          });
          setResults(res.data.filter((v) => !excludeIds.includes(v.id)));
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 350);
    },
    [excludeIds, allVehicles],
  );

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[#18181b] border border-white/8 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6">
          <span className="text-[#8e8e9a]">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by make, model, or year..."
            className="flex-1 bg-transparent text-sm text-[#f5f5f7] placeholder-[#555] outline-none"
          />
          <button
            onClick={onClose}
            title="Close search"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/6 transition-colors cursor-pointer"
          >
            <XIcon />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-[#8e8e9a]">
              <SpinnerIcon />
              <span className="ml-2 text-sm">Searching...</span>
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-[#8e8e9a]">
                {query.trim().length > 0
                  ? `No vehicles found for "${query}"`
                  : "No vehicles available"}
              </p>
              {query.trim().length > 0 && (
                <p className="text-[11px] text-[#555] mt-1">
                  Try a different search term
                </p>
              )}
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="py-2">
              {results.map((vehicle) => (
                <SearchResultRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Search result row ────────────────────────────────────────────────────────

function SearchResultRow({
  vehicle,
  onSelect,
}: {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}) {
  const title = getVehicleTitle(vehicle);
  const thumb = vehicle.images?.[0] ?? null;

  return (
    <button
      onClick={() => onSelect(vehicle)}
      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/4 transition-colors cursor-pointer text-left"
    >
      {/* Thumbnail */}
      <div className="w-14 h-10 rounded-lg bg-[#0c0c0e] overflow-hidden shrink-0">
        {thumb ? (
          <img src={thumb} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlaceholderIcon />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#f5f5f7] truncate">{title}</p>
        <div className="flex items-center gap-2 text-[11px] text-[#8e8e9a]">
          <span>{formatCurrencyFull(vehicle.price)}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-[#333]" />
          <span>{formatMileage(vehicle.mileage)}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-[#333]" />
          <span>{vehicle.city}</span>
        </div>
      </div>

      {/* Add indicator */}
      <span className="shrink-0 px-2.5 py-1 rounded-md bg-[#e63946]/10 text-[#e63946] text-[11px] font-medium">
        Add
      </span>
    </button>
  );
}
