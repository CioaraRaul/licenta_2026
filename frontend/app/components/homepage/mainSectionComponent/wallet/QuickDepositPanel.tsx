import { useState } from "react";
import { QUICK_DEPOSIT_AMOUNTS } from "~/constants/wallet.constants";
import { formatCurrencyFull } from "~/utils/format.utils";
import type { QuickDepositProps } from "~/interface/wallet.interface";

export default function QuickDepositPanel({
  card,
  onDeposit,
}: QuickDepositProps) {
  const [processing, setProcessing] = useState<number | null>(null);

  const handle = async (amount: number) => {
    setProcessing(amount);
    try {
      await onDeposit(amount);
    } catch {
      /* silent */
    } finally {
      setProcessing(null);
    }
  };

  const noCard = !card;

  return (
    <div className="bg-[#141417] border border-white/4 rounded-xl p-5 hover:border-white/8 transition-all h-full flex flex-col">
      <p className="text-xs font-medium text-[#8e8e9a] uppercase tracking-wider mb-3">
        Quick Deposit
      </p>

      {noCard && (
        <div className="bg-amber-500/6 border border-amber-500/10 rounded-lg px-3 py-2 mb-3">
          <p className="text-[11px] text-amber-400">
            Add a card to use quick deposit.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 flex-1 content-start">
        {QUICK_DEPOSIT_AMOUNTS.map((amt) => {
          const insufficientFunds = card ? card.balance < amt : false;
          const disabled = noCard || processing !== null || insufficientFunds;

          return (
            <button
              key={amt}
              onClick={() => handle(amt)}
              disabled={disabled}
              title={
                noCard
                  ? "Add a card first"
                  : insufficientFunds
                    ? `Insufficient card balance (${formatCurrencyFull(card!.balance)})`
                    : undefined
              }
              className="px-3 py-2.5 bg-white/3 border border-white/6 rounded-lg text-sm font-medium text-[#c5c5c7] hover:bg-white/6 hover:text-[#f5f5f7] hover:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {processing === amt ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              ) : (
                `$${amt.toLocaleString()}`
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
