import { formatCurrencyFull } from "~/utils/format.utils";
import {
  getTransactionLabel,
  getTransactionColor,
  getStatusBadge,
  isPositiveTransaction,
  formatTransactionDate,
} from "~/utils/wallet.utils";
import type { TransactionRowProps } from "~/interface/wallet.interface";
import { TransactionTypeIcon } from "./WalletIcons";

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const color = getTransactionColor(transaction.type);
  const status = getStatusBadge(transaction.status);
  const positive = isPositiveTransaction(transaction.type);

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
      {/* Type icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: color.bg }}
      >
        <TransactionTypeIcon type={transaction.type} color={color.text} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#f5f5f7]">
            {getTransactionLabel(transaction.type)}
          </span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        {transaction.description && (
          <p className="text-xs text-[#8e8e9a] truncate mt-0.5">
            {transaction.description}
          </p>
        )}
      </div>

      {/* Amount + date */}
      <div className="text-right shrink-0">
        <p
          className={`text-sm font-semibold ${
            positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {positive ? "+" : "-"}
          {formatCurrencyFull(transaction.amount)}
        </p>
        <p className="text-[11px] text-[#555] mt-0.5">
          {formatTransactionDate(transaction.createdAt)}
        </p>
      </div>
    </div>
  );
}
