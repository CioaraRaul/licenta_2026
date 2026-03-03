import { getTotalPages } from "~/utils/wallet.utils";
import type { TransactionListProps } from "~/interface/wallet.interface";
import { EmptyTxIcon } from "./WalletIcons";
import TransactionRow from "./TransactionRow";

export default function TransactionList({
  transactions,
  total,
  page,
  onPageChange,
  isLoading,
}: TransactionListProps) {
  const totalPages = getTotalPages(total);

  return (
    <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
        <div>
          <h3 className="text-base font-semibold text-[#f5f5f7]">
            Transaction History
          </h3>
          <p className="text-xs text-[#8e8e9a] mt-0.5">
            {total} transaction{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-white/[0.03]">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[#8e8e9a] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <EmptyTxIcon />
            <p className="text-[#8e8e9a] text-sm mt-3">
              No transactions yet. Deposit funds to get started.
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
          <p className="text-xs text-[#8e8e9a]">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs text-[#c5c5c7] bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs text-[#c5c5c7] bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
