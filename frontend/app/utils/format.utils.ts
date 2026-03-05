/** Format a number as currency (e.g. 1500 → "$1.5k", 2000000 → "$2.0M") */
export function formatCurrency(amount: number): string {
  const n = amount ?? 0;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}

/** Format a number as a currency with full value (e.g. 78500 → "$78,500") */
export function formatCurrencyFull(amount: number): string {
  return `$${(amount ?? 0).toLocaleString()}`;
}

/** Format mileage with thousands separator (e.g. 12400 → "12,400 mi") */
export function formatMileage(miles: number): string {
  return `${(miles ?? 0).toLocaleString()} mi`;
}

/** Format a date string as a relative time label (e.g. "2 min ago", "3 hours ago") */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format a full date string to a short readable date (e.g. "Feb 25") */
export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
