import { MOCK_SESSIONS } from "~/constants/settings.constants";
import { useTranslation } from "~/hooks/useTranslation";

export default function SecurityTab() {
  const t = useTranslation();
  const ts = t.settings.security;

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">{ts.password}</h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">{ts.passwordDesc}</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8e8e9a]" />
              ))}
            </div>
            <span className="text-[12px] text-[#555]">{ts.lastChanged}</span>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors"
          >
            {ts.changePassword}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">{ts.twoFactor}</h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">{ts.twoFactorDesc}</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] text-[#f5f5f7] font-medium">{ts.notEnabled}</p>
              <p className="text-[11px] text-[#8e8e9a]">{ts.recommended}</p>
            </div>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 bg-[#e63946]/10 border border-[#e63946]/20 rounded-lg text-[12px] text-[#e63946] font-medium hover:bg-[#e63946]/20 transition-colors"
          >
            {ts.enable}
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">{ts.activeSessions}</h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">{ts.activeSessionsDesc}</p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {MOCK_SESSIONS.map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8e8e9a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
                        {ts.current}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#8e8e9a]">{session.location}</p>
                </div>
              </div>
              {!session.current && (
                <button
                  type="button"
                  className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#8e8e9a] font-medium hover:bg-white/[0.07] transition-colors"
                >
                  {ts.revoke}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
