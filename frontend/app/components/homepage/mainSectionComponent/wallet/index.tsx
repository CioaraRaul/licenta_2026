import { useState, useCallback } from "react";
import {
  deposit as apiDeposit,
  getTransactions,
  getCard as apiGetCard,
} from "~/api/wallet.api";
import { TRANSACTIONS_PER_PAGE } from "~/constants/wallet.constants";
import type {
  Wallet,
  Transaction,
  Card,
  WalletPageData,
} from "~/interface/wallet.interface";
import { ErrorIcon } from "./WalletIcons";
import BalanceCard from "./BalanceCard";
import QuickDepositPanel from "./QuickDepositPanel";
import TransactionList from "./TransactionList";
import CardSection from "./CardSection";

export default function WalletComponent({
  wallet: initialWallet,
  transactions: initialTransactions,
  totalTransactions: initialTotal,
  card: initialCard,
  error,
}: WalletPageData) {
  const [wallet, setWallet] = useState<Wallet | null>(initialWallet);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [totalTransactions, setTotalTransactions] = useState(initialTotal);
  const [card, setCard] = useState<Card | null>(initialCard);
  const [page, setPage] = useState(1);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  /* ── Card handlers ──────────────────────────────────────────────────────── */
  const handleCardAdded = useCallback((newCard: Card) => {
    setCard(newCard);
  }, []);

  const handleCardDeleted = useCallback(() => {
    setCard(null);
  }, []);

  const handleCardToppedUp = useCallback((updatedCard: Card) => {
    setCard(updatedCard);
  }, []);

  /* ── Deposit handler ───────────────────────────────────────────────────── */
  const handleDeposit = useCallback(async (amount: number) => {
    const updated = await apiDeposit({ amount });
    setWallet(updated);
    // Refresh card balance (deposit deducts from card)
    try {
      const freshCard = await apiGetCard();
      setCard(freshCard);
    } catch {
      /* keep current */
    }
    // Refresh transactions to show the new deposit
    try {
      const result = await getTransactions(1, TRANSACTIONS_PER_PAGE);
      setTransactions(result.data);
      setTotalTransactions(result.total);
      setPage(1);
    } catch {
      /* keep existing list */
    }
  }, []);

  /* ── Pagination ────────────────────────────────────────────────────────── */
  const handlePageChange = useCallback(async (newPage: number) => {
    setIsLoadingTransactions(true);
    try {
      const result = await getTransactions(newPage, TRANSACTIONS_PER_PAGE);
      setTransactions(result.data);
      setTotalTransactions(result.total);
      setPage(newPage);
    } catch {
      /* keep current page */
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  /* ── Error state ───────────────────────────────────────────────────────── */
  if (error || !wallet) {
    return (
      <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-10 text-center">
            <ErrorIcon />
            <p className="text-[#8e8e9a] text-sm">
              Failed to load wallet. Please refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold text-[#f5f5f7] tracking-tight">
            Wallet
          </h1>
          <p className="text-sm text-[#8e8e9a] mt-1">
            Manage your balance and view transaction history.
          </p>
        </div>

        {/* Balance + Quick Deposit row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <BalanceCard
              wallet={wallet}
              card={card}
              onDeposit={handleDeposit}
            />
          </div>
          <QuickDepositPanel
            card={card}
            onDeposit={handleDeposit}
            isProcessing={false}
          />
        </div>

        {/* Card Management */}
        <CardSection
          card={card}
          onCardAdded={handleCardAdded}
          onCardDeleted={handleCardDeleted}
          onCardToppedUp={handleCardToppedUp}
        />

        {/* Transaction History */}
        <TransactionList
          transactions={transactions}
          total={totalTransactions}
          page={page}
          onPageChange={handlePageChange}
          isLoading={isLoadingTransactions}
        />
      </div>
    </div>
  );
}
