import type {
  TransactionType,
  TransactionStatus,
} from "~/interface/wallet.interface";

// ─── Transaction Type Labels ──────────────────────────────────────────────────

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  payment: "Payment",
  refund: "Refund",
  commission: "Commission",
};

// ─── Transaction Type Colors ──────────────────────────────────────────────────

export const TRANSACTION_TYPE_COLORS: Record<
  TransactionType,
  { bg: string; text: string }
> = {
  deposit: { bg: "rgba(16,185,129,0.10)", text: "#10b981" },
  withdrawal: { bg: "rgba(239,68,68,0.10)", text: "#ef4444" },
  payment: { bg: "rgba(239,68,68,0.10)", text: "#ef4444" },
  refund: { bg: "rgba(16,185,129,0.10)", text: "#10b981" },
  commission: { bg: "rgba(245,158,11,0.10)", text: "#f59e0b" },
};

// ─── Transaction Status Styles ────────────────────────────────────────────────

export const TRANSACTION_STATUS_STYLES: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-zinc-500/10 text-zinc-400",
  },
};

// ─── Quick Deposit Presets ────────────────────────────────────────────────────

export const QUICK_DEPOSIT_AMOUNTS = [50, 100, 250, 500, 1000, 5000] as const;

// ─── Pagination ───────────────────────────────────────────────────────────────

export const TRANSACTIONS_PER_PAGE = 10;
