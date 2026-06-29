import { useState } from "react";
import {
  CURRENCY_OPTIONS,
  DISTANCE_OPTIONS,
  THEME_OPTIONS,
} from "~/constants/settings.constants";
import { useTranslation } from "~/hooks/useTranslation";
import type { ThemeValue } from "~/interface/settings.interface";
import SettingsSelect from "../ui/SettingsSelect";

export default function PreferencesTab() {
  const [currency, setCurrency] = useState("USD");
  const [distance, setDistance] = useState("miles");
  const [theme, setTheme] = useState<ThemeValue>("dark");
  const t = useTranslation();
  const tp = t.settings.preferences;

  const themeLabels: Record<ThemeValue, string> = {
    dark: tp.themes.dark,
    light: tp.themes.light,
    system: tp.themes.system,
  };

  return (
    <div className="space-y-6">
      {/* Regional settings */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            {tp.regional}
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">{tp.regionalDesc}</p>
        </div>
        <div className="px-5 divide-y divide-white/[0.03]">
          <SettingsSelect
            label={tp.currency}
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS}
          />
          <SettingsSelect
            label={tp.distanceUnit}
            value={distance}
            onChange={setDistance}
            options={DISTANCE_OPTIONS}
          />
        </div>
      </div>

      {/* Theme */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">{tp.theme}</h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">{tp.themeDesc}</p>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((themeOpt) => (
            <button
              type="button"
              key={themeOpt.key}
              onClick={() => setTheme(themeOpt.key)}
              className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all ${
                theme === themeOpt.key
                  ? "border-[#e63946]/40 bg-[#e63946]/5"
                  : "border-white/[0.04] hover:border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg border border-white/[0.06]"
                style={{ background: themeOpt.bg }}
              />
              <span className="text-[12px] text-[#c2c2c9] font-medium">
                {themeLabels[themeOpt.key]}
              </span>
              {theme === themeOpt.key && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#e63946] flex items-center justify-center">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
