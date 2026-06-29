// ─── Settings Page Constants ──────────────────────────────────────────────────

import type { ReactNode } from "react";
import type {
  NotificationSetting,
  ConnectedAccount,
  SessionInfo,
  ThemeOption,
  ProfileField,
  SettingsTab,
} from "~/interface/settings.interface";
import type { User } from "~/interface/user.interface";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const SETTINGS_TABS = [
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notifications" },
  { key: "security", label: "Security" },
  { key: "preferences", label: "Preferences" },
  { key: "language", label: "Language" },
] as const satisfies readonly { key: SettingsTab; label: string }[];

// ─── Tab Icons ────────────────────────────────────────────────────────────────

export const TAB_ICONS: Record<SettingsTab, ReactNode> = {
  language: (
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
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
  profile: (
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
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  notifications: (
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
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  security: (
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  preferences: (
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    key: "emailNotifications",
    label: "Email Notifications",
    description:
      "Receive order confirmations, updates, and newsletters via email.",
  },
  {
    key: "bidAlerts",
    label: "Bid Alerts",
    description: "Get notified when someone places a bid on your listing.",
  },
  {
    key: "messageAlerts",
    label: "Message Alerts",
    description:
      "Get notified when you receive a new message from a buyer or seller.",
  },
  {
    key: "priceDropAlerts",
    label: "Price Drop Alerts",
    description: "Get notified when a saved vehicle drops in price.",
  },
  {
    key: "weeklyDigest",
    label: "Weekly Digest",
    description: "Receive a weekly summary of your account activity.",
  },
];

// ─── Profile ──────────────────────────────────────────────────────────────────

export function buildProfileFields(user: User | null): ProfileField[] {
  return [
    { label: "Username", value: user?.username ?? "—" },
    { label: "Email", value: user?.email ?? "—" },
    { label: "Role", value: user?.role ?? "—" },
    {
      label: "Member since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];
}

export const CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  { name: "Google", icon: "G", connected: false },
  { name: "GitHub", icon: "GH", connected: false },
];

// ─── Security ─────────────────────────────────────────────────────────────────

export const MOCK_SESSIONS: SessionInfo[] = [
  { device: "Windows — Chrome", location: "Bucharest, RO", current: true },
  { device: "iPhone — Safari", location: "Bucharest, RO", current: false },
];

// ─── Preferences ──────────────────────────────────────────────────────────────

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "RON", label: "RON (lei)" },
] as const;

export const DISTANCE_OPTIONS = [
  { value: "miles", label: "Miles" },
  { value: "km", label: "Kilometers" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ro", label: "Română" },
] as const;

export const THEME_OPTIONS: ThemeOption[] = [
  { key: "dark", label: "Dark", bg: "#0c0c0e" },
  { key: "light", label: "Light", bg: "#f5f5f7" },
  {
    key: "system",
    label: "System",
    bg: "linear-gradient(135deg, #0c0c0e 50%, #f5f5f7 50%)",
  },
];
