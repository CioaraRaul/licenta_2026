import { NOTIFICATION_SETTINGS } from "~/constants/settings.constants";
import Toggle from "../ui/Toggle";
import { useNotificationsStore } from "~/store/notifications.store";
import { useTranslation } from "~/hooks/useTranslation";
import type { NotificationPrefs } from "~/interface/notification.interface";

export default function NotificationsTab() {
  const { prefs, updatePrefs } = useNotificationsStore();
  const t = useTranslation();
  const tn = t.settings.notifications;

  const toggle = (key: keyof NotificationPrefs) =>
    updatePrefs({ [key]: !prefs[key] });

  return (
    <div className="space-y-6">
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            {tn.title}
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">{tn.subtitle}</p>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {NOTIFICATION_SETTINGS.map(({ key }) => {
            const item =
              tn.items[key as keyof typeof tn.items];
            return (
              <div
                key={key}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="pr-4">
                  <p className="text-[13px] text-[#f5f5f7] font-medium">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-[#8e8e9a] mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <Toggle
                  enabled={prefs[key as keyof NotificationPrefs] ?? true}
                  onToggle={() => toggle(key as keyof NotificationPrefs)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
              {tn.quietHours}
            </h3>
            <p className="text-[12px] text-[#8e8e9a] mt-0.5">
              {tn.quietHoursDesc}
            </p>
          </div>
          <Toggle
            enabled={prefs.quietHours}
            onToggle={() => toggle("quietHours")}
          />
        </div>
      </div>
    </div>
  );
}
