// ─── Shared form field components for the new listing wizard ──────────────────

interface InputProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#8e8e9a] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#e63946] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-[#e63946]/40 transition-colors"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  required?: boolean;
}

export function Select({
  label,
  value,
  onChange,
  options,
  required = false,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#8e8e9a] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#e63946] ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#f5f5f7] focus:outline-none focus:border-[#e63946]/40 transition-colors appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-[#1c1c21] text-[#f5f5f7]"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg transition-colors hover:border-white/[0.1]"
    >
      <span className="text-[13px] text-[#f5f5f7]">{label}</span>
      <div
        className={`w-9 h-5 rounded-full transition-colors relative ${checked ? "bg-[#10b981]" : "bg-white/[0.1]"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </div>
    </button>
  );
}
