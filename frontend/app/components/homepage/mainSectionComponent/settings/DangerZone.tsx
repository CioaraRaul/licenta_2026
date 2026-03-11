export default function DangerZone() {
  return (
    <div className="mt-8 bg-[#141417] border border-red-500/10 rounded-xl p-5">
      <h2 className="text-[15px] font-semibold text-red-400 mb-1">
        Danger Zone
      </h2>
      <p className="text-[12px] text-[#8e8e9a] mb-4">
        Irreversible actions. Please proceed with caution.
      </p>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#8e8e9a] font-medium hover:bg-white/[0.06] transition-colors">
          Export Data
        </button>
        <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[13px] text-red-400 font-medium hover:bg-red-500/20 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
