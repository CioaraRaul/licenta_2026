import type { ActionMenuProps } from "~/interface/vehicle.interface";

// ─── Action Menu ──────────────────────────────────────────────────────────────

export default function ActionMenu({
  vehicle,
  onDeactivate,
  onReactivate,
  onMarkSold,
  onDelete,
}: ActionMenuProps) {
  const actions: {
    label: string;
    icon: string;
    onClick: () => void;
    danger?: boolean;
  }[] = [];

  // Show contextual actions based on vehicle state
  if (vehicle.isActive && vehicle.status !== "sold") {
    actions.push({
      label: "Deactivate",
      icon: "M18.36 19.78L5.64 7.05M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      onClick: onDeactivate,
    });
  }

  if (!vehicle.isActive && vehicle.status !== "sold") {
    actions.push({
      label: "Reactivate",
      icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
      onClick: onReactivate,
    });
  }

  if (vehicle.status !== "sold" && vehicle.isActive) {
    actions.push({
      label: "Mark as Sold",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      onClick: onMarkSold,
    });
  }

  actions.push({
    label: "Delete",
    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    onClick: onDelete,
    danger: true,
  });

  return (
    <div className="absolute right-0 top-8 z-50 w-[160px] bg-[#1a1a1e] border border-white/[0.08] rounded-lg shadow-xl overflow-hidden">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-left transition-colors ${
            action.danger
              ? "text-[#f87171] hover:bg-[rgba(239,68,68,0.08)]"
              : "text-[#e8e8ed] hover:bg-white/[0.04]"
          }`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={action.icon} />
          </svg>
          {action.label}
        </button>
      ))}
    </div>
  );
}
