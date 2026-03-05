import { useState } from "react";
import { ChevronDownIcon } from "./FindVehicleIcons";

/* ── Collapsible section wrapper ─────────────────────────────────────────── */

export function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/6 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-4 text-[13px] font-medium text-[#f5f5f7] hover:bg-white/3 transition-colors"
      >
        {title}
        <ChevronDownIcon
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-4 pt-1 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

/* ── Small select wrapper ────────────────────────────────────────────────── */

export function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      title={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-2.5 text-[12px] text-[#f5f5f7] outline-none cursor-pointer focus:border-white/12 transition-colors appearance-none"
    >
      <option value="" className="bg-[#1c1c20] text-[#8e8e9a]">
        {placeholder}
      </option>
      {options.map((o) => (
        <option
          key={o.value}
          value={o.value}
          className="bg-[#1c1c20] text-[#e0e0e5]"
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ── Range input pair ────────────────────────────────────────────────────── */

export function RangeInputs({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromPlaceholder,
  toPlaceholder,
  fromLabel,
  toLabel,
}: {
  fromValue: string;
  toValue: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  fromPlaceholder: string;
  toPlaceholder: string;
  fromLabel: string;
  toLabel: string;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="number"
        title={fromLabel}
        value={fromValue}
        onChange={(e) => onFromChange(e.target.value)}
        placeholder={fromPlaceholder}
        className="w-1/2 bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-2 text-[12px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-white/12 transition-colors"
      />
      <input
        type="number"
        title={toLabel}
        value={toValue}
        onChange={(e) => onToChange(e.target.value)}
        placeholder={toPlaceholder}
        className="w-1/2 bg-[#1c1c20] border border-white/6 rounded-lg px-3 py-2 text-[12px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-white/12 transition-colors"
      />
    </div>
  );
}
