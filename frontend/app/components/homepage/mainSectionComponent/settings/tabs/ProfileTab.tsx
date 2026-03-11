import { useAuthStore } from "~/store/auth.store";
import {
  buildProfileFields,
  CONNECTED_ACCOUNTS,
} from "~/constants/settings.constants";

export default function ProfileTab() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#e63946]/20 via-[#e63946]/10 to-transparent relative">
          <div className="absolute -bottom-8 left-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e63946] to-[#c1121f] flex items-center justify-center text-white text-xl font-bold ring-4 ring-[#141417] font-['Playfair_Display',serif]">
              {(user?.username?.[0] ?? "U").toUpperCase()}
            </div>
          </div>
        </div>
        <div className="pt-12 px-5 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[#f5f5f7]">
                {user?.username ?? "Unknown"}
              </h3>
              <p className="text-[13px] text-[#8e8e9a] mt-0.5">
                {user?.email ?? "—"}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/20 capitalize">
              {user?.role ?? "user"}
            </span>
          </div>
        </div>
      </div>

      {/* Personal information */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
              Personal Information
            </h3>
            <p className="text-[12px] text-[#8e8e9a] mt-0.5">
              Your account details and public profile info.
            </p>
          </div>
          <button className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors">
            Edit
          </button>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {buildProfileFields(user).map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <span className="text-[13px] text-[#8e8e9a]">{label}</span>
              <span className="text-[13px] text-[#f5f5f7] font-medium capitalize">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected accounts */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            Connected Accounts
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Link third-party accounts for faster sign-in.
          </p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {CONNECTED_ACCOUNTS.map((acc) => (
            <div
              key={acc.name}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-[11px] font-bold text-[#8e8e9a]">
                  {acc.icon}
                </div>
                <div>
                  <p className="text-[13px] text-[#f5f5f7] font-medium">
                    {acc.name}
                  </p>
                  <p className="text-[11px] text-[#8e8e9a]">
                    {acc.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors">
                {acc.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
