import type {
  TransactionType,
  TransactionStatus,
  CardType,
} from "~/interface/wallet.interface";
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_STATUS_STYLES,
} from "~/constants/wallet.constants";
import { formatCurrencyFull } from "~/utils/format.utils";

/* ─── Transaction type → human-readable label ────────────────────────────── */

export function getTransactionLabel(type: TransactionType): string {
  return TRANSACTION_TYPE_LABELS[type] ?? type;
}

/* ─── Transaction type → icon color / accent ─────────────────────────────── */

export function getTransactionColor(type: TransactionType) {
  return TRANSACTION_TYPE_COLORS[type] ?? TRANSACTION_TYPE_COLORS.deposit;
}

/* ─── Transaction status → badge info ────────────────────────────────────── */

export function getStatusBadge(status: TransactionStatus) {
  return TRANSACTION_STATUS_STYLES[status] ?? TRANSACTION_STATUS_STYLES.pending;
}

/* ─── Amount sign: positive (deposit/refund) vs negative (payment/withdrawal) */

export function isPositiveTransaction(type: TransactionType): boolean {
  return type === "deposit" || type === "refund";
}

/* ─── Format a transaction date for the list ─────────────────────────────── */

export function formatTransactionDate(dateString: string): string {
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: now.getFullYear() !== d.getFullYear() ? "numeric" : undefined,
  });
}

/* ─── Validate a custom deposit amount ───────────────────────────────────── */

export function validateDepositAmount(
  value: string,
): { valid: true; amount: number } | { valid: false; error: string } {
  const num = Number(value);
  if (!value || isNaN(num))
    return { valid: false, error: "Enter a valid amount" };
  if (num <= 0)
    return { valid: false, error: "Amount must be greater than $0" };
  if (num > 100_000)
    return { valid: false, error: "Maximum deposit is $100,000" };
  if (!/^\d+(\.\d{1,2})?$/.test(value))
    return { valid: false, error: "Max 2 decimal places" };
  return { valid: true, amount: num };
}

/* ─── Validate a custom withdrawal amount ────────────────────────────────── */

export function validateWithdrawalAmount(
  value: string,
  availableBalance: number,
): { valid: true; amount: number } | { valid: false; error: string } {
  const num = Number(value);
  if (!value || isNaN(num))
    return { valid: false, error: "Enter a valid amount" };
  if (num <= 0)
    return { valid: false, error: "Amount must be greater than $0" };
  if (!/^\d+(\.\d{1,2})?$/.test(value))
    return { valid: false, error: "Max 2 decimal places" };
  if (num > availableBalance)
    return {
      valid: false,
      error: `Insufficient balance (${formatCurrencyFull(availableBalance)} available)`,
    };
  if (num > 100_000)
    return { valid: false, error: "Maximum withdrawal is $100,000" };
  return { valid: true, amount: num };
}

/* ─── Transaction pagination ─────────────────────────────────────────────── */

export function getTotalPages(total: number): number {
  return Math.max(1, Math.ceil((Number(total) || 0) / 10));
}

/* ─── Card helpers ────────────────────────────────────────────────────────── */

export function detectCardType(number: string): CardType {
  const clean = number.replace(/\s/g, "");
  return clean.startsWith("4") ? "visa" : "mastercard";
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}
