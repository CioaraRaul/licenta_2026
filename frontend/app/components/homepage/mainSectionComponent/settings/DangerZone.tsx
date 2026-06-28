import { useState } from "react";
import { useAuthStore } from "~/store/auth.store";
import { deleteMyAccount } from "~/api/users.api";
import { useTranslation } from "~/hooks/useTranslation";

export default function DangerZone() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const t = useTranslation();
  const td = t.settings.dangerZone;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleExportData = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-CA");
    const time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const data = {
      exportedAt: `${date} at ${time}`,
      profile: {
        userId: user?.id,
        username: user?.username,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role,
        bio: user?.bio,
        isEmailVerified: user?.isEmailVerified,
        createdAt: user?.createdAt,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `account-data-${user?.username ?? "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setDeleteError(td.modal.noPassword);
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMyAccount(password);
      logout();
    } catch {
      setDeleteError(td.modal.error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mt-8 bg-[#141417] border border-red-500/10 rounded-xl p-5">
        <h2 className="text-[15px] font-semibold text-red-400 mb-1">
          {td.title}
        </h2>
        <p className="text-[12px] text-[#8e8e9a] mb-4">{td.subtitle}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#8e8e9a] font-medium hover:bg-white/[0.06] transition-colors"
          >
            {td.exportData}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDeleteModal(true);
              setDeleteError(null);
              setPassword("");
            }}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[13px] text-red-400 font-medium hover:bg-red-500/20 transition-colors"
          >
            {td.deleteAccount}
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1e] border border-white/[0.06] rounded-xl p-6 w-full max-w-md shadow-2xl mx-4">
            <h3 className="text-[16px] font-semibold text-red-400 mb-1">
              {td.modal.title}
            </h3>
            <p className="text-[13px] text-[#8e8e9a] mb-5">
              {td.modal.description}
            </p>
            <label
              htmlFor="delete-password"
              className="block text-[12px] text-[#8e8e9a] mb-1.5"
            >
              {td.modal.password}
            </label>
            <input
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDeleteAccount()}
              placeholder={td.modal.passwordPlaceholder}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-[#f5f5f7] placeholder-[#555] focus:outline-none focus:border-red-500/40 mb-4"
            />
            {deleteError && (
              <p className="text-[12px] text-red-400 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 border border-red-500/30 rounded-lg text-[13px] text-red-400 font-medium transition-colors"
              >
                {deleting ? td.modal.deleting : td.modal.confirm}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors"
              >
                {td.modal.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
