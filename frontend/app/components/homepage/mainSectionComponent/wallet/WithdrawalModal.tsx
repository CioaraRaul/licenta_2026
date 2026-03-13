import { useState } from "react";
import { validateWithdrawalAmount } from "~/utils/wallet.utils";
import { formatCurrencyFull } from "~/utils/format.utils";
import type { WithdrawalModalProps } from "~/interface/wallet.interface";
import { CloseIcon } from "./WalletIcons";

export default function WithdrawalModal({
  isOpen,
  onClose,
  onWithdraw,
  isProcessing,
  walletBalance,
  card,
}: WithdrawalModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateWithdrawalAmount(value, walletBalance);
    if (!result.valid) {
      setError(result.error);
      return;
    }

    if (!card) {
      setError("No card found. Add a card to receive withdrawn funds.");
      return;
    }

    setError("");
    try {
      await onWithdraw(result.amount);
      setValue("");
    } catch {
      setError("Withdrawal failed. Please try again.");
    }
  };

  const canWithdraw = walletBalance > 0 && !!card;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1f] border border-white/6 rounded-2xl p-6 w-full max-w-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-[#f5f5f7]">
            Withdraw Funds
          </h3>
          <button
            onClick={onClose}
            title="Close"
            className="w-8 h-8 rounded-lg hover:bg-white/6 flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Available balance banner */}
        <div className="flex items-center justify-between bg-white/3 rounded-lg px-4 py-3 mb-4">
          <span className="text-xs text-[#8e8e9a] font-medium uppercase tracking-wider">
            Available Balance
          </span>
          <span className="text-sm font-semibold text-[#f5f5f7]">
            {formatCurrencyFull(walletBalance)}
          </span>
        </div>

        {/* Card destination */}
        {card ? (
          <div className="flex items-center justify-between bg-white/3 rounded-lg px-4 py-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#8e8e9a] uppercase">
                {card.cardType === "visa" ? "VISA" : "MC"}
              </span>
              <span className="text-sm text-[#c5c5c7] font-mono">
                •••• {card.last4}
              </span>
            </div>
            <span className="text-xs text-[#8e8e9a]">Destination</span>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-red-400">
              No card linked. Add a payment card to withdraw funds.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Amount input */}
          <div className="mb-4">
            <label className="text-xs text-[#8e8e9a] font-medium uppercase tracking-wider mb-1.5 block">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8e9a] text-lg font-medium">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                placeholder="0.00"
                disabled={!canWithdraw}
                className="w-full bg-white/4 border border-white/6 rounded-xl pl-8 pr-4 py-3 text-lg text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/40 transition-colors disabled:opacity-40"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>

          {/* Quick amount chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[100, 250, 500, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                disabled={!canWithdraw || amt > walletBalance}
                onClick={() => {
                  setValue(String(amt));
                  setError("");
                }}
                className="px-3 py-1.5 bg-white/4 border border-white/6 rounded-lg text-xs text-[#c5c5c7] hover:bg-white/8 hover:text-[#f5f5f7] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing || !value || !canWithdraw}
            className="w-full py-3 bg-[#e63946] hover:bg-[#d62836] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            {isProcessing ? "Processing..." : "Withdraw"}
          </button>
        </form>
      </div>
    </div>
  );
}
