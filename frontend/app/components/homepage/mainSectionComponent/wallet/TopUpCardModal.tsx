import { useState } from "react";
import { topUpCard } from "~/api/wallet.api";
import { formatCurrencyFull } from "~/utils/format.utils";
import type { TopUpCardModalProps } from "~/interface/wallet.interface";
import { CloseIcon } from "./WalletIcons";

const QUICK_TOPUP_AMOUNTS = [500, 1000, 5000, 10000, 50000, 100000] as const;

export default function TopUpCardModal({
  isOpen,
  onClose,
  card,
  onCardToppedUp,
}: TopUpCardModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amount = Number(value);
    if (!value || isNaN(amount)) {
      setError("Enter a valid amount");
      return;
    }
    if (amount <= 0) {
      setError("Amount must be greater than $0");
      return;
    }
    if (amount > 1_000_000) {
      setError("Maximum top-up is $1,000,000");
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      setError("Max 2 decimal places");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedCard = await topUpCard({ amount });
      onCardToppedUp(updatedCard);
      setValue("");
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Top-up failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#1a1a1f] border border-white/6 rounded-2xl p-6 w-full max-w-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-[#f5f5f7]">Top Up Card</h3>
          <button
            onClick={onClose}
            title="Close"
            className="w-8 h-8 rounded-lg hover:bg-white/6 flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Current card balance */}
        <div className="bg-white/3 rounded-lg px-4 py-3 mb-4">
          <p className="text-[10px] text-[#8e8e9a] uppercase tracking-wider mb-0.5">
            Current Card Balance
          </p>
          <p className="text-lg font-bold text-[#f5f5f7]">
            {formatCurrencyFull(card.balance)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
                className="w-full bg-white/4 border border-white/6 rounded-xl pl-8 pr-4 py-3 text-lg text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/40 transition-colors"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>

          {/* Quick amount chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {QUICK_TOPUP_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setValue(String(amt));
                  setError("");
                }}
                className="px-3 py-1.5 bg-white/4 border border-white/6 rounded-lg text-xs text-[#c5c5c7] hover:bg-white/8 hover:text-[#f5f5f7] transition-all cursor-pointer"
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !value}
            className="w-full py-3 bg-[#e63946] hover:bg-[#d62836] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            {isSubmitting ? "Processing..." : "Top Up Card"}
          </button>
        </form>
      </div>
    </div>
  );
}
