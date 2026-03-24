import type { SettingsSelectProps } from "~/interface/settings.interface";

export default function SettingsSelect({
  label,
  value,
  onChange,
  options,
}: SettingsSelectProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[13px] text-[#c2c2c9]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[13px] text-[#f5f5f7] outline-none focus:border-[#e63946]/40 transition-colors cursor-pointer appearance-none pr-7"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238e8e9a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#1a1a1f]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
