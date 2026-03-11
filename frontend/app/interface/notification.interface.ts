// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType =
  | "new_message"
  | "bid_placed"
  | "bid_accepted"
  | "bid_rejected"
  | "bid_withdrawn";

// ─── Notification Entity ──────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

// ─── Preferences (keys match NOTIFICATION_SETTINGS keys + quietHours) ─────────

export interface NotificationPrefs {
  emailNotifications: boolean;
  bidAlerts: boolean;
  messageAlerts: boolean;
  priceDropAlerts: boolean;
  weeklyDigest: boolean;
  quietHours: boolean;
}

// ─── Store Shape ──────────────────────────────────────────────────────────────

export interface NotificationsState {
  notifications: AppNotification[];
  prefs: NotificationPrefs;
  unreadCount: number;
  lastFetched: string | null;
  fetch: () => Promise<void>;
  markAllRead: () => void;
  markRead: (id: string) => void;
  updatePrefs: (partial: Partial<NotificationPrefs>) => void;
  clearAll: () => void;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface NotificationBellProps {}
