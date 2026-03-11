import { useEffect, useRef, useState } from "react";
import { useNotificationsStore } from "~/store/notifications.store";
import {
  NOTIFICATION_ICONS,
  POLL_INTERVAL_MS,
  timeAgo,
} from "~/constants/notifications.constants";
import type { NotificationBellProps } from "~/interface/notification.interface";

export default function NotificationBell(_props: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, fetch, markAllRead, markRead } =
    useNotificationsStore();

  // Fetch on mount, on tab focus, on visibility change, and fallback interval
  useEffect(() => {
    fetch();

    const onVisibility = () => {
      if (document.visibilityState === "visible") fetch();
    };
    const onFocus = () => fetch();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetch();
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((v) => {
            if (!v) fetch(); // refresh when opening dropdown
            return !v;
          });
        }}
        className="relative w-8 h-8 rounded-lg bg-[#1c1c21]/60 flex items-center justify-center hover:bg-[#26262d] transition-colors"
        aria-label="Notifications"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8e8e9a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e63946] ring-2 ring-[#111114]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-[#141417] border border-white/[0.06] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
            <span className="text-[13px] font-semibold text-[#f5f5f7]">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1 text-[11px] text-[#e63946]">
                  ({unreadCount})
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-[#8e8e9a] hover:text-[#f5f5f7] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.03]">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[12px] text-[#8e8e9a]">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                    !n.read ? "bg-[#e63946]/[0.03]" : ""
                  }`}
                  onClick={() => markRead(n.id)}
                >
                  <span className="text-base mt-0.5 flex-shrink-0">
                    {NOTIFICATION_ICONS[n.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[12px] font-medium leading-snug ${
                        !n.read ? "text-[#f5f5f7]" : "text-[#8e8e9a]"
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="text-[11px] text-[#8e8e9a] mt-0.5 leading-relaxed line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-[#8e8e9a]/60 mt-1">
                      {timeAgo(n.timestamp)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] mt-1.5 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
