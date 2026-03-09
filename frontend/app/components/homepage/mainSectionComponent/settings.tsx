import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import {
  SETTINGS_TABS,
  NOTIFICATION_SETTINGS,
  CURRENCY_OPTIONS,
  DISTANCE_OPTIONS,
  LANGUAGE_OPTIONS,
  type SettingsTab,
} from "~/constants/settings.constants";

/* ─── Tiny reusable sub-components ──────────────────────────────────────────── */

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
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

function SettingsSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { readonly value: string; readonly label: string }[];
}) {
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

/* ─── Tab icons ─────────────────────────────────────────────────────────────── */

const TabIcons: Record<SettingsTab, ReactNode> = {
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  notifications: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  security: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  preferences: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
};

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function SettingsComponent() {
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        NOTIFICATION_SETTINGS.map((n) => [n.key, true])
      )
  );
  const [currency, setCurrency] = useState("USD");
  const [distance, setDistance] = useState("miles");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

  const toggleNotification = (key: string) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ─── Tab renderers ───────────────────────────────────────────────────────── */

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#e63946]/20 via-[#e63946]/10 to-transparent relative">
          <div className="absolute -bottom-8 left-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e63946] to-[#c1121f] flex items-center justify-center text-white text-xl font-bold ring-4 ring-[#141417] font-['Playfair_Display',serif]">
              {(user?.username?.[0] ?? "U").toUpperCase()}
            </div>
          </div>
        </div>
        <div className="pt-12 px-5 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[#f5f5f7]">
                {user?.username ?? "Unknown"}
              </h3>
              <p className="text-[13px] text-[#8e8e9a] mt-0.5">
                {user?.email ?? "—"}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/20 capitalize">
              {user?.role ?? "user"}
            </span>
          </div>
        </div>
      </div>

      {/* Personal information */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
              Personal Information
            </h3>
            <p className="text-[12px] text-[#8e8e9a] mt-0.5">
              Your account details and public profile info.
            </p>
          </div>
          <button className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors">
            Edit
          </button>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {[
            { label: "Username", value: user?.username ?? "—" },
            { label: "Email", value: user?.email ?? "—" },
            { label: "Role", value: user?.role ?? "—" },
            { label: "Member since", value: "January 2025" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[13px] text-[#8e8e9a]">{label}</span>
              <span className="text-[13px] text-[#f5f5f7] font-medium capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected accounts */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            Connected Accounts
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Link third-party accounts for faster sign-in.
          </p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {[
            { name: "Google", connected: false, icon: "G" },
            { name: "GitHub", connected: false, icon: "GH" },
          ].map((acc) => (
            <div key={acc.name} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-[11px] font-bold text-[#8e8e9a]">
                  {acc.icon}
                </div>
                <div>
                  <p className="text-[13px] text-[#f5f5f7] font-medium">{acc.name}</p>
                  <p className="text-[11px] text-[#8e8e9a]">
                    {acc.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors">
                {acc.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            Notification Preferences
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Choose which notifications you'd like to receive.
          </p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {NOTIFICATION_SETTINGS.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between px-5 py-4">
              <div className="pr-4">
                <p className="text-[13px] text-[#f5f5f7] font-medium">{label}</p>
                <p className="text-[11px] text-[#8e8e9a] mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>
              <Toggle
                enabled={notifications[key]}
                onToggle={() => toggleNotification(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quiet hours */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
              Quiet Hours
            </h3>
            <p className="text-[12px] text-[#8e8e9a] mt-0.5">
              Mute all notifications between 10 PM and 7 AM.
            </p>
          </div>
          <Toggle enabled={false} onToggle={() => {}} />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Password */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">Password</h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Manage your password to keep your account secure.
          </p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8e8e9a]" />
              ))}
            </div>
            <span className="text-[12px] text-[#555]">Last changed 30 days ago</span>
          </div>
          <button className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors">
            Change Password
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            Two-Factor Authentication
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Add an extra layer of security to your account.
          </p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] text-[#f5f5f7] font-medium">Not enabled</p>
              <p className="text-[11px] text-[#8e8e9a]">
                Recommended for enhanced security
              </p>
            </div>
          </div>
          <button className="px-3.5 py-1.5 bg-[#e63946]/10 border border-[#e63946]/20 rounded-lg text-[12px] text-[#e63946] font-medium hover:bg-[#e63946]/20 transition-colors">
            Enable
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            Active Sessions
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Devices currently logged in to your account.
          </p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {[
            { device: "Windows — Chrome", location: "Bucharest, RO", current: true },
            { device: "iPhone — Safari", location: "Bucharest, RO", current: false },
          ].map((session) => (
            <div key={session.device} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-[#f5f5f7] font-medium flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#10b981]/10 text-[#10b981]">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#8e8e9a]">{session.location}</p>
                </div>
              </div>
              {!session.current && (
                <button className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#8e8e9a] font-medium hover:bg-white/[0.07] transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      {/* Locale */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            Regional Settings
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Configure currency, units, and language.
          </p>
        </div>
        <div className="px-5 divide-y divide-white/[0.03]">
          <SettingsSelect
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS}
          />
          <SettingsSelect
            label="Distance Unit"
            value={distance}
            onChange={setDistance}
            options={DISTANCE_OPTIONS}
          />
          <SettingsSelect
            label="Language"
            value={language}
            onChange={setLanguage}
            options={LANGUAGE_OPTIONS}
          />
        </div>
      </div>

      {/* Theme */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">Theme</h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Choose how AutoVault looks for you.
          </p>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {(
            [
              { key: "dark", label: "Dark", bg: "#0c0c0e", fg: "#f5f5f7" },
              { key: "light", label: "Light", bg: "#f5f5f7", fg: "#1a1a1f" },
              { key: "system", label: "System", bg: "linear-gradient(135deg, #0c0c0e 50%, #f5f5f7 50%)", fg: "" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all ${
                theme === t.key
                  ? "border-[#e63946]/40 bg-[#e63946]/5"
                  : "border-white/[0.04] hover:border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg border border-white/[0.06]"
                style={{ background: t.bg }}
              />
              <span className="text-[12px] text-[#c2c2c9] font-medium">
                {t.label}
              </span>
              {theme === t.key && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#e63946] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

  const tabContent: Record<SettingsTab, () => ReactNode> = {
    profile: renderProfile,
    notifications: renderNotifications,
    security: renderSecurity,
    preferences: renderPreferences,
  };

  /* ─── Render ──────────────────────────────────────────────────────────────── */

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
              Dashboard
            </Link>
            <span className="text-[#555]">/</span>
            <span className="text-[#f5f5f7]">Settings</span>
          </div>
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-[#8e8e9a] mt-1">
            Manage your account preferences and configuration.
          </p>
        </div>

        {/* Layout: sidebar tabs + content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-[200px] shrink-0 hidden md:block">
            <nav className="space-y-1 sticky top-6">
              {SETTINGS_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left ${
                    activeTab === key
                      ? "bg-[#e63946]/10 text-[#e63946]"
                      : "text-[#8e8e9a] hover:text-[#c2c2c9] hover:bg-white/[0.03]"
                  }`}
                >
                  {TabIcons[key]}
                  {label}
                </button>
              ))}

              {/* Danger zone tab */}
              <div className="pt-3 mt-3 border-t border-white/[0.04]">
                <button
                  onClick={() => setActiveTab("profile")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Danger Zone
                </button>
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile tab bar */}
            <div className="flex gap-1 mb-5 overflow-x-auto pb-1 md:hidden">
              {SETTINGS_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`shrink-0 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all ${
                    activeTab === key
                      ? "bg-[#e63946]/10 text-[#e63946]"
                      : "text-[#8e8e9a] hover:bg-white/[0.03]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tabContent[activeTab]()}

            {/* Danger zone — always visible below content */}
            <div className="mt-8 bg-[#141417] border border-red-500/10 rounded-xl p-5">
              <h2 className="text-[15px] font-semibold text-red-400 mb-1">
                Danger Zone
              </h2>
              <p className="text-[12px] text-[#8e8e9a] mb-4">
                Irreversible actions. Please proceed with caution.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#8e8e9a] font-medium hover:bg-white/[0.06] transition-colors">
                  Export Data
                </button>
                <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[13px] text-red-400 font-medium hover:bg-red-500/20 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
