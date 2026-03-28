import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import { USER_MENU_ITEMS } from "~/constants/userMenu.constants";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleAction = (action: string) => {
    setOpen(false);
    if (action === "logout") {
      logout();
      navigate("/auth/login");
    }
  };

  return (
    <header className="h-14 bg-[#111114] border-b border-white/[0.04] flex items-center justify-between px-5 flex-shrink-0">
      <div />

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-4">
        <NotificationBell />

        {/* Divider */}
        <div className="w-px h-6 bg-white/[0.06]" />

        {/* User Menu */}
        <div className="relative">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setOpen(!open)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e63946] to-[#c62833] flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-white/[0.06] group-hover:ring-[#e63946]/30 transition-all">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden md:block">
              <div className="text-[12px] font-medium text-[#e8e8ed] leading-tight group-hover:text-[#f5f5f7] transition-colors">
                {user?.username || "User"}
              </div>
              <div className="text-[10px] text-[#8e8e9a] leading-tight capitalize">
                {user?.role || "member"}
              </div>
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8e8e9a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 group-hover:stroke-[#bbbbc6] ${open ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {open && (
            <div className="absolute right-0 top-12 w-48 bg-[#141417] border border-white/[0.06] rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
              {USER_MENU_ITEMS.map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#c2c2c9] hover:bg-white/[0.04] hover:text-[#f5f5f7] transition-colors no-underline"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => handleAction(item.action!)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#c2c2c9] hover:bg-white/[0.04] hover:text-[#f5f5f7] transition-colors w-full"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
