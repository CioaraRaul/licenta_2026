import { useState } from "react";
import { deleteCard } from "~/api/wallet.api";
import { formatCurrencyFull } from "~/utils/format.utils";
import type { CardSectionProps } from "~/interface/wallet.interface";
import { CardChipIcon, TopUpIcon, TrashIcon } from "./WalletIcons";
import AddCardModal from "./AddCardModal";
import TopUpCardModal from "./TopUpCardModal";

export default function CardSection({
  card,
  onCardAdded,
  onCardDeleted,
  onCardToppedUp,
}: CardSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this card? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteCard();
      onCardDeleted();
    } catch {
      /* silent */
    } finally {
      setIsDeleting(false);
    }
  };

  // No card — show "Add Card" prompt
  if (!card) {
    return (
      <>
        <div className="bg-[#141417] border border-white/4 rounded-xl p-6 hover:border-white/8 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#8e8e9a] uppercase tracking-wider mb-1">
                Payment Card
              </p>
              <p className="text-sm text-[#c5c5c7]">
                Add a card to start depositing funds into your wallet.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#e63946] hover:bg-[#d62836] text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
            >
              Add Card
            </button>
          </div>
        </div>

        <AddCardModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCardAdded={onCardAdded}
        />
      </>
    );
  }

  // Card exists — show visual card display
  const isVisa = card.cardType === "visa";

  return (
    <>
      <div className="bg-[#141417] border border-white/4 rounded-xl p-6 hover:border-white/8 transition-all">
        <div className="flex items-start gap-5">
          {/* Visual card */}
          <div
            className={`rounded-xl p-5 w-72 shrink-0 relative overflow-hidden ${
              isVisa
                ? "bg-gradient-to-br from-[#1a1f71] to-[#2a3f9f]"
                : "bg-gradient-to-br from-[#1a1a2e] to-[#e63946]/30"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <CardChipIcon />
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                {isVisa ? "VISA" : "MASTERCARD"}
              </span>
            </div>
            <p className="text-[15px] font-mono text-white/90 tracking-[0.18em] mb-4">
              •••• •••• •••• {card.last4}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] text-white/40 uppercase tracking-wider">
                  Cardholder
                </p>
                <p className="text-[11px] text-white/80 font-medium">
                  {card.cardHolderName}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-white/40 uppercase tracking-wider">
                  Expires
                </p>
                <p className="text-[11px] text-white/80 font-medium">
                  {String(card.expiryMonth).padStart(2, "0")}/
                  {String(card.expiryYear).slice(-2)}
                </p>
              </div>
            </div>
          </div>

          {/* Card info + actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-[#8e8e9a] uppercase tracking-wider mb-1">
                  Card Balance
                </p>
                <p className="text-2xl font-bold text-[#f5f5f7]">
                  {formatCurrencyFull(card.balance)}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#8e8e9a] mb-4">
              This balance is used when depositing funds into your wallet. Top
              up your card to make deposits.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#e63946] hover:bg-[#d62836] text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
              >
                <TopUpIcon />
                Top Up Card
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-white/4 border border-white/6 text-[#c5c5c7] text-sm font-medium rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 disabled:opacity-40 transition-all cursor-pointer"
              >
                <TrashIcon />
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <TopUpCardModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        card={card}
        onCardToppedUp={onCardToppedUp}
      />
    </>
  );
}
