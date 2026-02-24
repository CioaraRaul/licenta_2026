export enum TransactionType {
  DEPOSIT = 'deposit', // Depunere bani în wallet
  WITHDRAWAL = 'withdrawal', // Retragere bani din wallet
  PAYMENT = 'payment', // Plată pentru un vehicul (buyer → seller)
  REFUND = 'refund', // Rambursare (bid respins sau retras)
  COMMISSION = 'commission', // Comision platformă
}
