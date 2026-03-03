// ─── Enums ───────────────────────────────────────────────────────────────────

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "payment"
  | "refund"
  | "commission";

export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

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

// ─── Component props ──────────────────────────────────────────────────────────

export interface WalletPageData {
  wallet: Wallet | null;
  transactions: Transaction[];
  totalTransactions: number;
  error: boolean;
}

export interface BalanceCardProps {
  wallet: Wallet;
  onDeposit: (amount: number) => Promise<void>;
}

export interface TransactionListProps {
  transactions: Transaction[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export interface TransactionRowProps {
  transaction: Transaction;
}

export interface QuickDepositProps {
  onDeposit: (amount: number) => Promise<void>;
  isProcessing: boolean;
}

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => Promise<void>;
  isProcessing: boolean;
}
