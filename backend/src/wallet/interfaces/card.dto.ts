export interface CreateCardDto {
  cardNumber: string; // Full 16-digit number (we store only last 4)
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

export interface TopUpCardDto {
  amount: number;
}
