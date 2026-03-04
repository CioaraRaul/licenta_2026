import { useState } from "react";
import { addCard } from "~/api/wallet.api";
import type { AddCardModalProps, CardType } from "~/interface/wallet.interface";
import { detectCardType, formatCardNumber } from "~/utils/wallet.utils";
import { CloseIcon } from "./WalletIcons";

export default function AddCardModal({
  isOpen,
  onClose,
  onCardAdded,
}: AddCardModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cleanNumber = cardNumber.replace(/\s/g, "");
  const detectedType: CardType = detectCardType(cleanNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    if (cleanNumber.length !== 16) {
      setError("Card number must be 16 digits");
      return;
    }
    if (!cardHolderName.trim() || cardHolderName.trim().length < 2) {
      setError("Cardholder name is required");
      return;
    }
    const month = Number(expiryMonth);
    const year = Number(expiryYear);
    if (!month || month < 1 || month > 12) {
      setError("Invalid expiry month");
      return;
    }
    const now = new Date();
    if (
      !year ||
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    ) {
      setError("Card has expired");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits");
      return;
    }

    setIsSubmitting(true);
    try {
      const card = await addCard({
        cardNumber: cleanNumber,
        cardHolderName: cardHolderName.trim(),
        expiryMonth: month,
        expiryYear: year,
        cvv,
      });
      onCardAdded(card);
      onClose();
      // Reset form
      setCardNumber("");
      setCardHolderName("");
      setExpiryMonth("");
      setExpiryYear("");
      setCvv("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add card";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#1a1a1f] border border-white/6 rounded-2xl p-6 w-full max-w-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-[#f5f5f7]">
            Add Payment Card
          </h3>
          <button
            onClick={onClose}
            title="Close"
            className="w-8 h-8 rounded-lg hover:bg-white/6 flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Card preview */}
        <div
          className={`rounded-xl p-5 mb-5 relative overflow-hidden ${
            detectedType === "visa"
              ? "bg-gradient-to-br from-[#1a1f71] to-[#2a3f9f]"
              : "bg-gradient-to-br from-[#1a1a2e] to-[#e63946]/30"
          }`}
        >
          <div className="flex justify-between items-start mb-8">
            <div className="w-10 h-7 rounded bg-amber-400/80" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
              {detectedType === "visa" ? "VISA" : "MASTERCARD"}
            </span>
          </div>
          <p className="text-[17px] font-mono text-white/90 tracking-[0.2em] mb-4">
            {cleanNumber
              ? formatCardNumber(cleanNumber)
              : "•••• •••• •••• ••••"}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-wider">
                Cardholder
              </p>
              <p className="text-xs text-white/80 font-medium">
                {cardHolderName || "YOUR NAME"}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-wider">
                Expires
              </p>
              <p className="text-xs text-white/80 font-medium">
                {expiryMonth || "MM"}/
                {expiryYear ? String(expiryYear).slice(-2) : "YY"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Card number */}
          <div>
            <label className="text-[11px] text-[#8e8e9a] font-medium uppercase tracking-wider mb-1 block">
              Card Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formatCardNumber(cleanNumber)}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full bg-white/4 border border-white/6 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/40 transition-colors font-mono"
            />
          </div>

          {/* Cardholder name */}
          <div>
            <label className="text-[11px] text-[#8e8e9a] font-medium uppercase tracking-wider mb-1 block">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              className="w-full bg-white/4 border border-white/6 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/40 transition-colors"
            />
          </div>

          {/* Expiry + CVV row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[11px] text-[#8e8e9a] font-medium uppercase tracking-wider mb-1 block">
                Expiry Month
              </label>
              <select
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                className="w-full bg-white/4 border border-white/6 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f7] outline-none focus:border-[#e63946]/40 transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#1a1a1f]">
                  MM
                </option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m} className="bg-[#1a1a1f]">
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-[#8e8e9a] font-medium uppercase tracking-wider mb-1 block">
                Expiry Year
              </label>
              <select
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                className="w-full bg-white/4 border border-white/6 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f7] outline-none focus:border-[#e63946]/40 transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#1a1a1f]">
                  YY
                </option>
                {Array.from({ length: 10 }, (_, i) => currentYear + i).map(
                  (y) => (
                    <option key={y} value={y} className="bg-[#1a1a1f]">
                      {y}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-[#8e8e9a] font-medium uppercase tracking-wider mb-1 block">
                CVV
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="•••"
                maxLength={4}
                className="w-full bg-white/4 border border-white/6 rounded-lg px-3 py-2.5 text-sm text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/40 transition-colors font-mono"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 bg-[#e63946] hover:bg-[#d62836] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            {isSubmitting ? "Adding Card..." : "Add Card"}
          </button>
        </form>
      </div>
    </div>
  );
}
