/** Returns the display label and Tailwind CSS classes for a vehicle status badge */
export function getVehicleStatusBadge(
  status: string,
  isActive: boolean,
): { label: string; cls: string } {
  if (!isActive) {
    return { label: "Inactive", cls: "bg-[rgba(239,68,68,0.12)] text-[#f87171]" };
  }
  switch (status) {
    case "available":
      return { label: "Active",    cls: "bg-[rgba(16,185,129,0.12)] text-[#10b981]" };
    case "pending":
      return { label: "Pending",   cls: "bg-[rgba(245,158,11,0.12)] text-[#f59e0b]" };
    case "sold":
      return { label: "Sold",      cls: "bg-white/[0.06] text-[#8e8e9a]" };
    case "reserved":
      return { label: "Reserved",  cls: "bg-[rgba(59,130,246,0.12)] text-[#60a5fa]" };
    default:
      return { label: status,      cls: "bg-white/[0.06] text-[#8e8e9a]" };
  }
}

/** Returns a human-readable fuel type label */
export function getFuelTypeLabel(fuelType: string): string {
  const labels: Record<string, string> = {
    gasoline:     "Gasoline",
    diesel:       "Diesel",
    electric:     "Electric",
    hybrid:       "Hybrid",
    plugin_hybrid: "Plug-in Hybrid",
  };
  return labels[fuelType] ?? fuelType;
}

/** Returns a human-readable transmission label */
export function getTransmissionLabel(transmission: string): string {
  const labels: Record<string, string> = {
    manual:        "Manual",
    automatic:     "Automatic",
    semi_automatic: "Semi-Auto",
  };
  return labels[transmission] ?? transmission;
}
