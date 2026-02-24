import { httpClient } from './http.api';
import type {
  Wallet,
  Transaction,
  DepositPayload,
} from '~/interface/wallet.interface';
import type { PaginatedResponse } from '~/interface/vehicle.interface';

/** GET /wallet — soldul și detaliile portofelului utilizatorului curent */
export async function getWallet(): Promise<Wallet> {
  return httpClient.get<Wallet>('/wallet');
}

/** POST /wallet/deposit — adaugă fonduri în portofel */
export async function deposit(payload: DepositPayload): Promise<Wallet> {
  return httpClient.post<Wallet>('/wallet/deposit', payload);
}

/** GET /wallet/transactions — istoricul tranzacțiilor cu paginare */
export async function getTransactions(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Transaction>> {
  return httpClient.get<PaginatedResponse<Transaction>>(
    '/wallet/transactions',
    { params: { page, limit } },
  );
}
