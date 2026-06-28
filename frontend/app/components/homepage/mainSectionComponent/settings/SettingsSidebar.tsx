import { SETTINGS_TABS, TAB_ICONS } from "~/constants/settings.constants";
import type { SettingsSidebarProps } from "~/interface/settings.interface";
import { useTranslation } from "~/hooks/useTranslation";

export default function SettingsSidebar({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  const t = useTranslation();

  return (
    <div className="w-[200px] shrink-0 hidden md:block">
      <nav className="space-y-1 sticky top-6">
        {SETTINGS_TABS.map(({ key }) => (
          <button
            type="button"
            key={key}
            onClick={() => onTabChange(key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left ${
              activeTab === key
                ? "bg-[#e63946]/10 text-[#e63946]"
                : "text-[#8e8e9a] hover:text-[#c2c2c9] hover:bg-white/[0.03]"
            }`}
          >
            {TAB_ICONS[key]}
            {t.settings.tabs[key]}
          </button>
        ))}

        <div className="pt-3 mt-3 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={() => onTabChange("profile")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {t.settings.sidebarDangerZone}
          </button>
        </div>
      </nav>
    </div>
  );
}
