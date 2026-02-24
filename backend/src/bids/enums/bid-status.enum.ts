export enum BidStatus {
  PENDING = 'pending', // Bid-ul e activ, așteaptă răspuns
  ACCEPTED = 'accepted', // Seller-ul a acceptat
  REJECTED = 'rejected', // Seller-ul a respins
  WITHDRAWN = 'withdrawn', // Buyer-ul a retras bid-ul
  EXPIRED = 'expired', // Vehiculul a fost vândut altcuiva
}
