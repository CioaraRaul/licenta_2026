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

export type CardType = "visa" | "mastercard";

// ─── Wallet entity ────────────────────────────────────────────────────────────

export interface Wallet {
  id: number;
  balance: number;
  frozenBalance: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Card entity ──────────────────────────────────────────────────────────────

export interface Card {
  id: number;
  last4: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardType: CardType;
  balance: number;
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

export interface AddCardPayload {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

export interface TopUpCardPayload {
  amount: number;
}

// ─── Component props ──────────────────────────────────────────────────────────

export interface WalletPageData {
  wallet: Wallet | null;
  transactions: Transaction[];
  totalTransactions: number;
  card: Card | null;
  error: boolean;
}

export interface BalanceCardProps {
  wallet: Wallet;
  card: Card | null;
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
  card: Card | null;
  onDeposit: (amount: number) => Promise<void>;
  isProcessing: boolean;
}

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => Promise<void>;
  isProcessing: boolean;
  card: Card | null;
}

export interface CardSectionProps {
  card: Card | null;
  onCardAdded: (card: Card) => void;
  onCardDeleted: () => void;
  onCardToppedUp: (card: Card) => void;
}

export interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardAdded: (card: Card) => void;
}

export interface TopUpCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  onCardToppedUp: (card: Card) => void;
}
