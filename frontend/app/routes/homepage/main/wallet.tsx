import { useLoaderData } from "react-router";
import { getWallet, getTransactions, getCard } from "~/api/wallet.api";
import { TRANSACTIONS_PER_PAGE } from "~/constants/wallet.constants";
import WalletComponent from "~/components/homepage/mainSectionComponent/wallet";

export async function clientLoader() {
  try {
    const [wallet, transactionsResult, card] = await Promise.all([
      getWallet(),
      getTransactions(1, TRANSACTIONS_PER_PAGE),
      getCard(),
    ]);
    return {
      wallet,
      transactions: transactionsResult.data,
      totalTransactions: transactionsResult.total,
      card,
      error: false,
    };
  } catch {
    return {
      wallet: null,
      transactions: [],
      totalTransactions: 0,
      card: null,
      error: true,
    };
  }
}

function Wallet() {
  const data = useLoaderData<typeof clientLoader>();
  return <WalletComponent {...data} />;
}

export default Wallet;
