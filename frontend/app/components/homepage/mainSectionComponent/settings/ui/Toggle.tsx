import type { ToggleProps } from "~/interface/settings.interface";

export default function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-[#e63946]" : "bg-white/[0.08]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
