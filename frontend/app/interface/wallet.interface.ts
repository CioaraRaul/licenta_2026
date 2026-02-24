// ─── Enums ───────────────────────────────────────────────────────────────────

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'payment'
  | 'refund'
  | 'commission';

export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled';

// ─── Wallet entity ────────────────────────────────────────────────────────────

export interface Wallet {
  id: number;
  balance: number;
  frozenBalance: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Transaction entity ───────────────────────────────────────────────────────

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;

  /** ID of the related entity (vehicle, bid, etc.) */
  referenceId?: number;

  userId: number;
  recipientId?: number;

  createdAt: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface DepositPayload {
  amount: number;
}
