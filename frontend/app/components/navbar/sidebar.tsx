import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import { getConversations } from "~/api/messages.api";

export default function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  const isSeller = user?.role === "seller" || user?.role === "admin";
  const isActive = (href: string) => location.pathname === href;

  useEffect(() => {
    if (!user) return;

    const fetchUnread = () => {
      getConversations()
        .then((convs) => {
          const total = convs.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
          setUnreadCount(total);
        })
        .catch(() => {});
    };

    fetchUnread();

    // Refresh unread count when the user returns to the tab
    const handleFocus = () => fetchUnread();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const mainNav = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
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
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: (
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
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      badge: unreadCount || undefined,
    },
    ...(isSeller
      ? [
          {
            label: "My Listings",
            href: "/my-listings",
            icon: (
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
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            ),
          },
        ]
      : []),
    {
      label: "Wallet",
      href: "/wallet",
      icon: (
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
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
  ];

  const vehicleNav = [
    {
      label: "Find Vehicle",
      href: "/find-vehicle",
      icon: (
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
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      label: "Saved",
      href: "/saved",
      icon: (
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
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      label: "My Bids",
      href: "/bids",
      icon: (
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
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: "Compare",
      href: "/compare",
      icon: (
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
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  const bottomNav = [
    {
      label: "Help & Support",
      href: "/dashboard",
      icon: (
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
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: "/dashboard",
      icon: (
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
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ];

  const NavLink = ({
    item,
  }: {
    item: (typeof mainNav)[0] & { badge?: number };
  }) => (
    <Link
      to={item.href}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline relative ${
        isActive(item.href)
          ? "bg-[#e63946] text-white shadow-[0_4px_12px_rgba(230,57,70,0.25)]"
          : "text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.04]"
      }`}
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {"badge" in item && item.badge && !isActive(item.href) ? (
            <span className="ml-auto min-w-[20px] h-5 rounded-full bg-[#e63946] text-white text-[11px] font-bold flex items-center justify-center px-1.5">
              {item.badge}
            </span>
          ) : null}
        </>
      )}
      {collapsed && "badge" in item && item.badge ? (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e63946]" />
      ) : null}
    </Link>
  );

  return (
    <aside
      className={`${collapsed ? "w-[68px]" : "w-[232px]"} h-screen bg-[#111114] border-r border-white/[0.04] flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-white/[0.04] flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-[#e63946] flex items-center justify-center flex-shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-['Playfair_Display',serif] text-[16px] font-bold text-[#f5f5f7] tracking-tight">
              AutoVault
            </span>
          )}
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {/* Main section */}
        {!collapsed && (
          <div className="text-[10px] font-semibold text-[#8e8e9a]/50 uppercase tracking-[0.08em] px-3 mb-2">
            Main
          </div>
        )}
        <div className="flex flex-col gap-0.5 mb-5">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        {/* Vehicles section */}
        {!collapsed && (
          <div className="text-[10px] font-semibold text-[#8e8e9a]/50 uppercase tracking-[0.08em] px-3 mb-2">
            Vehicles
          </div>
        )}
        {collapsed && (
          <div className="mx-3 mb-2 border-t border-white/[0.04]" />
        )}
        <div className="flex flex-col gap-0.5">
          {vehicleNav.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Sell CTA — seller only */}
      {isSeller && !collapsed && (
        <div className="mx-3 mb-3 p-4 bg-gradient-to-br from-[#1c1c21] to-[#141417] border border-white/[0.06] rounded-xl">
          <div className="w-9 h-9 rounded-full bg-[rgba(230,57,70,0.12)] flex items-center justify-center mb-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e63946"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div className="text-[13px] font-semibold text-[#f5f5f7] mb-0.5">
            List a vehicle
          </div>
          <p className="text-[11px] text-[#8e8e9a] leading-relaxed mb-3">
            Reach thousands of verified buyers.
          </p>
          <Link
            to="/my-listings/new"
            className="block w-full py-2 bg-[#e63946] rounded-lg text-white text-[12px] font-semibold text-center no-underline hover:shadow-[0_4px_12px_rgba(230,57,70,0.3)] transition-all duration-300"
          >
            + New Listing
          </Link>
        </div>
      )}

      {/* Bottom nav */}
      <div className="px-3 pb-2 flex flex-col gap-0.5 border-t border-white/[0.04] pt-2">
        {bottomNav.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 no-underline text-[#8e8e9a] hover:text-[#c5c5ca] hover:bg-white/[0.03]"
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity">
              {item.icon}
            </span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 flex items-center justify-center border-t border-white/[0.04] text-[#8e8e9a] hover:text-[#f5f5f7] hover:bg-white/[0.03] transition-colors flex-shrink-0"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </aside>
  );
}
