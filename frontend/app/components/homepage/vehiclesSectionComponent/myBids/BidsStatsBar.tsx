import type { BidsStatsBarProps } from "~/interface/bid.interface";

// ─── BidsStatsBar ─────────────────────────────────────────────────────────────

export default function BidsStatsBar({ stats }: BidsStatsBarProps) {
  const items = [
    { label: "Total", value: stats.total, color: "text-[#f5f5f7]" },
    { label: "Pending", value: stats.pending, color: "text-[#f59e0b]" },
    { label: "Accepted", value: stats.accepted, color: "text-[#10b981]" },
    { label: "Rejected", value: stats.rejected, color: "text-[#f87171]" },
    { label: "Expired", value: stats.expired, color: "text-[#8e8e9a]" },
    { label: "Withdrawn", value: stats.withdrawn, color: "text-[#8b5cf6]" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6">
      {items.map((s) => (
        <div
          key={s.label}
          className="bg-[#141417] border border-white/[0.04] rounded-xl px-4 py-3 text-center"
        >
          <div className={`text-[20px] font-bold ${s.color}`}>{s.value}</div>
          <div className="text-[11px] text-[#8e8e9a] mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
