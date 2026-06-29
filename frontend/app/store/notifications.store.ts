import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  NotificationsState,
  AppNotification,
} from "~/interface/notification.interface";
import {
  DEFAULT_NOTIFICATION_PREFS,
  QUIET_HOURS_START,
  QUIET_HOURS_END,
} from "~/constants/notifications.constants";
import { getConversations } from "~/api/messages.api";
import { getMyBids, getReceivedBids } from "~/api/bids.api";
import { useAuthStore } from "~/store/auth.store";

function isQuietHours(): boolean {
  const hour = new Date().getHours();
  return hour >= QUIET_HOURS_START || hour < QUIET_HOURS_END;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      prefs: DEFAULT_NOTIFICATION_PREFS,
      unreadCount: 0,
      lastFetched: null,

      fetch: async () => {
        const { prefs, notifications } = get();
        if (prefs.quietHours && isQuietHours()) return;

        const role = useAuthStore.getState().user?.role;
        if (role === "guest" || !role) return;

        const existingIds = new Set(notifications.map((n) => n.id));
        const fresh: AppNotification[] = [];

        if (prefs.messageAlerts) {
          try {
            const convs = await getConversations();
            for (const c of convs) {
              if (c.unreadCount > 0) {
                const id = `msg-${c.id}-${c.updatedAt}`;
                if (!existingIds.has(id)) {
                  fresh.push({
                    id,
                    type: "new_message",
                    title: "New message",
                    body: `${c.lastMessage ?? "You have a new message"}${c.vehicle ? ` — ${c.vehicle.year} ${c.vehicle.make} ${c.vehicle.model}` : ""}`,
                    timestamp: c.updatedAt,
                    read: false,
                    link: "/messages",
                  });
                }
              }
            }
          } catch {
            // network errors silently ignored
          }
        }

        if (prefs.bidAlerts && (role === "seller" || role === "admin")) {
          try {
            const { data: received } = await getReceivedBids(1, 20);
            for (const bid of received) {
              const id = `bid-recv-${bid.id}`;
              if (!existingIds.has(id)) {
                fresh.push({
                  id,
                  type: "bid_placed",
                  title: "New bid received",
                  body: `${bid.buyer.username} offered $${bid.amount}${bid.vehicle ? ` on ${bid.vehicle.year} ${bid.vehicle.make} ${bid.vehicle.model}` : ""}`,
                  timestamp: bid.createdAt,
                  read: false,
                  link: "/bids",
                });
              }
            }
          } catch {
            // silently ignored
          }
        }

        if (prefs.bidAlerts && role === "buyer") {
          try {
            const { data: mine } = await getMyBids(1, 20);
            for (const bid of mine) {
              if (bid.status === "accepted") {
                const id = `bid-accepted-${bid.id}`;
                if (!existingIds.has(id)) {
                  fresh.push({
                    id,
                    type: "bid_accepted",
                    title: "Bid accepted!",
                    body: `Your offer of $${bid.amount}${bid.vehicle ? ` on ${bid.vehicle.year} ${bid.vehicle.make} ${bid.vehicle.model}` : ""} was accepted`,
                    timestamp: bid.updatedAt,
                    read: false,
                    link: "/bids",
                  });
                }
              }
              if (bid.status === "rejected") {
                const id = `bid-rejected-${bid.id}`;
                if (!existingIds.has(id)) {
                  fresh.push({
                    id,
                    type: "bid_rejected",
                    title: "Bid rejected",
                    body: `Your offer${bid.vehicle ? ` on ${bid.vehicle.year} ${bid.vehicle.make} ${bid.vehicle.model}` : ""} was declined`,
                    timestamp: bid.updatedAt,
                    read: false,
                    link: "/bids",
                  });
                }
              }
              if (bid.status === "withdrawn") {
                const id = `bid-withdrawn-${bid.id}`;
                if (!existingIds.has(id)) {
                  fresh.push({
                    id,
                    type: "bid_withdrawn",
                    title: "Bid withdrawn",
                    body: `A bid${bid.vehicle ? ` on ${bid.vehicle.year} ${bid.vehicle.make} ${bid.vehicle.model}` : ""} was withdrawn`,
                    timestamp: bid.updatedAt,
                    read: false,
                    link: "/bids",
                  });
                }
              }
            }
          } catch {
            // silently ignored
          }
        }

        if (fresh.length > 0) {
          set((state) => {
            const merged = [...fresh, ...state.notifications].slice(0, 50);
            return {
              notifications: merged,
              unreadCount: merged.filter((n) => !n.read).length,
              lastFetched: new Date().toISOString(),
            };
          });
        } else {
          set({ lastFetched: new Date().toISOString() });
        }
      },

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      markRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          );
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        }),

      updatePrefs: (partial) =>
        set((state) => ({ prefs: { ...state.prefs, ...partial } })),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "notifications-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        prefs: state.prefs,
        unreadCount: state.unreadCount,
        lastFetched: state.lastFetched,
      }),
    },
  ),
);
