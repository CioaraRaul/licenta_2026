import { useState } from "react";
import { formatCurrencyFull } from "~/utils/format.utils";
import type { BalanceCardProps } from "~/interface/wallet.interface";
import { WalletIcon, LockIcon, PlusIcon } from "./WalletIcons";
import DepositModal from "./DepositModal";

export default function BalanceCard({
  wallet,
  card,
  onDeposit,
}: BalanceCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async (amount: number) => {
    setIsProcessing(true);
    try {
      await onDeposit(amount);
      setShowModal(false);
    } catch {
      /* handled by modal */
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-[#141417] border border-white/4 rounded-xl p-6 hover:border-white/8 transition-all h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#8e8e9a] text-xs font-medium uppercase tracking-wider mb-1">
              Available Balance
            </p>
            <h2 className="text-[36px] font-bold text-[#f5f5f7] tracking-tight leading-none">
              {formatCurrencyFull(wallet.balance)}
            </h2>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#e63946]/10 flex items-center justify-center">
            <WalletIcon />
          </div>
        </div>

        {/* Frozen balance indicator */}
        {wallet.frozenBalance > 0 && (
          <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-amber-500/6 border border-amber-500/10 rounded-lg">
            <LockIcon />
            <span className="text-xs text-amber-400">
              {formatCurrencyFull(wallet.frozenBalance)} frozen in active bids
            </span>
          </div>
        )}

        {/* Stat chips */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/3 rounded-lg px-4 py-3">
            <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
              Total
            </p>
            <p className="text-sm font-semibold text-[#f5f5f7]">
              {formatCurrencyFull(wallet.balance + wallet.frozenBalance)}
            </p>
          </div>
          <div className="flex-1 bg-white/3 rounded-lg px-4 py-3">
            <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
              Frozen
            </p>
            <p className="text-sm font-semibold text-amber-400">
              {formatCurrencyFull(wallet.frozenBalance)}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#e63946] hover:bg-[#d62836] text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
          >
            <PlusIcon />
            Deposit
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDeposit={handleDeposit}
        isProcessing={isProcessing}
        card={card}
      />
    </>
  );
}
