// ─── Settings Page Constants ──────────────────────────────────────────────────

import type { NotificationSetting } from "~/interface/settings.interface";

export const SETTINGS_TABS = [
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notifications" },
  { key: "security", label: "Security" },
  { key: "preferences", label: "Preferences" },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]["key"];

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
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
] as const;
