import { useState } from "react";
import { validateDepositAmount } from "~/utils/wallet.utils";
import type { DepositModalProps } from "~/interface/wallet.interface";
import { CloseIcon } from "./WalletIcons";

export default function DepositModal({
  isOpen,
  onClose,
  onDeposit,
  isProcessing,
}: DepositModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDepositAmount(value);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError("");
    try {
      await onDeposit(result.amount);
      setValue("");
    } catch {
      setError("Deposit failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1f] border border-white/[0.06] rounded-2xl p-6 w-full max-w-[400px] shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-[#f5f5f7]">
            Deposit Funds
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

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
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-8 pr-4 py-3 text-lg text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/40 transition-colors"
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
                onClick={() => {
                  setValue(String(amt));
                  setError("");
                }}
                className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-[#c5c5c7] hover:bg-white/[0.08] hover:text-[#f5f5f7] transition-all cursor-pointer"
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing || !value}
            className="w-full py-3 bg-[#e63946] hover:bg-[#d62836] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            {isProcessing ? "Processing..." : "Deposit"}
          </button>
        </form>
      </div>
    </div>
  );
}
