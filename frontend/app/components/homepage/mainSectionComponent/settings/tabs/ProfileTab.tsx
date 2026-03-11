import { useState } from "react";
import { useAuthStore } from "~/store/auth.store";
import {
  buildProfileFields,
  CONNECTED_ACCOUNTS,
} from "~/constants/settings.constants";
import { updateProfile } from "~/api/users.api";
import type { ProfileFormState } from "~/interface/settings.interface";

export default function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const setUsers = useAuthStore((s) => s.setUsers);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileFormState>({
    username: user?.username ?? "",
    email: user?.email ?? "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    bio: user?.bio ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [connectedAccounts, setConnectedAccounts] =
    useState(CONNECTED_ACCOUNTS);
  const [accountMsg, setAccountMsg] = useState<string | null>(null);

  const handleEdit = () => {
    setForm({
      username: user?.username ?? "",
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      bio: user?.bio ?? "",
    });
    setIsEditing(true);
    setBanner(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBanner(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      const updated = await updateProfile({
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio,
      });
      setUsers(updated);
      setIsEditing(false);
      setBanner({ type: "success", message: "Profile updated successfully." });
    } catch {
      setBanner({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConnectToggle = (name: string) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) =>
        acc.name === name ? { ...acc, connected: !acc.connected } : acc,
      ),
    );
    setAccountMsg("OAuth integration coming soon. State is local only.");
    setTimeout(() => setAccountMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {banner && (
        <div
          className={`px-4 py-3 rounded-lg text-[13px] font-medium border ${
            banner.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {banner.message}
        </div>
      )}

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
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="p-5 space-y-4">
            {(
              [
                {
                  label: "Username",
                  key: "username" as keyof ProfileFormState,
                },
                {
                  label: "First Name",
                  key: "firstName" as keyof ProfileFormState,
                },
                {
                  label: "Last Name",
                  key: "lastName" as keyof ProfileFormState,
                },
                { label: "Bio", key: "bio" as keyof ProfileFormState },
              ] as const
            ).map(({ label, key }) => (
              <div key={key}>
                <label
                  htmlFor={`field-${key}`}
                  className="block text-[12px] text-[#8e8e9a] mb-1.5"
                >
                  {label}
                </label>
                {key === "bio" ? (
                  <textarea
                    id={`field-${key}`}
                    rows={3}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-[#e63946]/40 resize-none"
                  />
                ) : (
                  <input
                    id={`field-${key}`}
                    type="text"
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-[#e63946]/40"
                  />
                )}
              </div>
            ))}
            <div>
              <label
                htmlFor="field-email"
                className="block text-[12px] text-[#8e8e9a] mb-1.5"
              >
                Email{" "}
                <span className="text-[#555] text-[11px]">(read-only)</span>
              </label>
              <input
                id="field-email"
                type="text"
                value={form.email}
                readOnly
                className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2 text-[13px] text-[#555] cursor-not-allowed"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 rounded-lg text-[13px] text-white font-medium transition-colors"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
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
        )}
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
        {accountMsg && (
          <div className="mx-5 mt-4 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-[#8e8e9a]">
            {accountMsg}
          </div>
        )}
        <div className="divide-y divide-white/[0.03]">
          {connectedAccounts.map((acc) => (
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
              <button
                onClick={() => handleConnectToggle(acc.name)}
                className={`px-3 py-1.5 border rounded-lg text-[12px] font-medium transition-colors ${
                  acc.connected
                    ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    : "bg-white/[0.04] border-white/[0.06] text-[#c2c2c9] hover:bg-white/[0.07]"
                }`}
              >
                {acc.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
