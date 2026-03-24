import { useAuthStore } from "~/store/auth.store";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-14 bg-[#111114] border-b border-white/[0.04] flex items-center justify-between px-5 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2.5 bg-[#0c0c0e] border border-white/[0.06] rounded-xl px-3.5 py-2 w-full max-w-md">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8e8e9a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search vehicles, brands, models…"
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#f5f5f7] placeholder:text-[#8e8e9a]/40 font-['DM_Sans',sans-serif]"
        />
        <kbd className="hidden lg:inline-block text-[10px] text-[#8e8e9a]/60 bg-[#1c1c21] px-1.5 py-0.5 rounded font-mono border border-white/[0.04]">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-4">
        <NotificationBell />

        {/* Divider */}
        <div className="w-px h-6 bg-white/[0.06]" />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
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
            className="group-hover:stroke-[#bbbbc6] transition-colors"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
