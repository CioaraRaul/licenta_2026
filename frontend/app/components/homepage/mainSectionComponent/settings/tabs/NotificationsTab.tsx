import { useState } from "react";
import { NOTIFICATION_SETTINGS } from "~/constants/settings.constants";
import Toggle from "../ui/Toggle";

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () => Object.fromEntries(NOTIFICATION_SETTINGS.map((n) => [n.key, true])),
  );

  const toggleNotification = (key: string) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      {/* Per-notification toggles */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            Notification Preferences
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">
            Choose which notifications you'd like to receive.
          </p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {NOTIFICATION_SETTINGS.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="pr-4">
                <p className="text-[13px] text-[#f5f5f7] font-medium">
                  {label}
                </p>
                <p className="text-[11px] text-[#8e8e9a] mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>
              <Toggle
                enabled={notifications[key]}
                onToggle={() => toggleNotification(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quiet hours */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
              Quiet Hours
            </h3>
            <p className="text-[12px] text-[#8e8e9a] mt-0.5">
              Mute all notifications between 10 PM and 7 AM.
            </p>
          </div>
          <Toggle enabled={false} onToggle={() => {}} />
        </div>
      </div>
    </div>
  );
}
