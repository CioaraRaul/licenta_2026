import { useState } from "react";
import { QUICK_DEPOSIT_AMOUNTS } from "~/constants/wallet.constants";
import type { QuickDepositProps } from "~/interface/wallet.interface";

export default function QuickDepositPanel({ onDeposit }: QuickDepositProps) {
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

  return (
    <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5 hover:border-white/[0.08] transition-all h-full flex flex-col">
      <p className="text-xs font-medium text-[#8e8e9a] uppercase tracking-wider mb-3">
        Quick Deposit
      </p>
      <div className="grid grid-cols-2 gap-2 flex-1 content-start">
        {QUICK_DEPOSIT_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => handle(amt)}
            disabled={processing !== null}
            className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm font-medium text-[#c5c5c7] hover:bg-white/[0.06] hover:text-[#f5f5f7] hover:border-white/[0.10] disabled:opacity-40 transition-all cursor-pointer"
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
        ))}
      </div>
    </div>
  );
}
