import type {
  NotificationPrefs,
  NotificationType,
} from "~/interface/notification.interface";

export const QUIET_HOURS_START = 22;
export const QUIET_HOURS_END = 7;
export const POLL_INTERVAL_MS = 60_000;

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  emailNotifications: true,
  bidAlerts: true,
  messageAlerts: true,
  priceDropAlerts: true,
  weeklyDigest: true,
  quietHours: false,
};

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  new_message: "💬",
  bid_placed: "💰",
  bid_accepted: "✅",
  bid_rejected: "❌",
  bid_withdrawn: "↩️",
};

export function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
