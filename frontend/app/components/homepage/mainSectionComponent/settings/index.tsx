import { useState, type ComponentType } from "react";
import { Link } from "react-router";
import { SETTINGS_TABS } from "~/constants/settings.constants";
import type { SettingsTab } from "~/interface/settings.interface";
import { useTranslation } from "~/hooks/useTranslation";
import SettingsSidebar from "./SettingsSidebar";
import DangerZone from "./DangerZone";
import ProfileTab from "./tabs/ProfileTab";
import NotificationsTab from "./tabs/NotificationsTab";
import SecurityTab from "./tabs/SecurityTab";
import PreferencesTab from "./tabs/PreferencesTab";
import LanguageTab from "./tabs/LanguageTab";

const TAB_COMPONENTS: Record<SettingsTab, ComponentType> = {
  profile: ProfileTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  preferences: PreferencesTab,
  language: LanguageTab,
};

export default function SettingsComponent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const t = useTranslation();

  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[13px] text-[#8e8e9a] mb-3">
            <Link
              to="/dashboard"
              className="hover:text-[#f5f5f7] transition-colors no-underline text-[#8e8e9a]"
            >
              {t.settings.breadcrumb.dashboard}
            </Link>
            <span className="text-[#555]">/</span>
            <span className="text-[#f5f5f7]">{t.settings.breadcrumb.settings}</span>
          </div>
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
            {t.settings.title}
          </h1>
          <p className="text-sm text-[#8e8e9a] mt-1">{t.settings.subtitle}</p>
        </div>

        {/* Layout: sidebar + content */}
        <div className="flex gap-6">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 min-w-0">
            {/* Mobile tab bar */}
            <div className="flex gap-1 mb-5 overflow-x-auto pb-1 md:hidden">
              {SETTINGS_TABS.map(({ key }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`shrink-0 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all ${
                    activeTab === key
                      ? "bg-[#e63946]/10 text-[#e63946]"
                      : "text-[#8e8e9a] hover:bg-white/[0.03]"
                  }`}
                >
                  {t.settings.tabs[key]}
                </button>
              ))}
            </div>

            {/* Active tab */}
            <ActiveTabComponent />

            <DangerZone />
          </div>
        </div>
      </div>
    </div>
  );
}
