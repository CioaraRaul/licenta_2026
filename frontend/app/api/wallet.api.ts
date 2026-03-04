import { httpClient } from "./http.api";
import type {
  Wallet,
  Transaction,
  DepositPayload,
  Card,
  AddCardPayload,
  TopUpCardPayload,
} from "~/interface/wallet.interface";
import type { PaginatedResponse } from "~/interface/vehicle.interface";

/** GET /wallet — soldul și detaliile portofelului utilizatorului curent */
export async function getWallet(): Promise<Wallet> {
  return httpClient.get<Wallet>("/wallet");
}

/** POST /wallet/deposit — depune fonduri din card în portofel */
export async function deposit(payload: DepositPayload): Promise<Wallet> {
  return httpClient.post<Wallet>("/wallet/deposit", payload);
}

/** GET /wallet/transactions — istoricul tranzacțiilor cu paginare */
export async function getTransactions(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Transaction>> {
  return httpClient.get<PaginatedResponse<Transaction>>(
    "/wallet/transactions",
    { params: { page, limit } },
  );
}

/** GET /wallet/card — cardul utilizatorului (sau null) */
export async function getCard(): Promise<Card | null> {
  return httpClient.get<Card | null>("/wallet/card");
}

/** POST /wallet/card — adaugă un card nou */
export async function addCard(payload: AddCardPayload): Promise<Card> {
  return httpClient.post<Card>("/wallet/card", payload);
}

/** DELETE /wallet/card — șterge cardul */
export async function deleteCard(): Promise<void> {
  return httpClient.delete("/wallet/card");
}

/** POST /wallet/card/topup — alimentează cardul cu o sumă */
export async function topUpCard(payload: TopUpCardPayload): Promise<Card> {
  return httpClient.post<Card>("/wallet/card/topup", payload);
}
