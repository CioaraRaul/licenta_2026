import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { Card } from './entities/card.entity';
import { TransactionType } from './enums/transaction-type.enum';
import { TransactionStatus } from './enums/transaction-status.enum';
import type { CreateCardDto, TopUpCardDto } from './interfaces/card.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,

    // DataSource pentru tranzacții atomice (deposit + transfer în același timp)
    private readonly dataSource: DataSource,
  ) {}

  // ─── Get or Create Wallet ──────────────────────────────────────────────────

  async getOrCreateWallet(userId: number): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) {
      wallet = this.walletRepo.create({ userId, balance: 0, frozenBalance: 0 });
      await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  // ─── Get Wallet ────────────────────────────────────────────────────────────

  async getWallet(userId: number): Promise<Wallet> {
    return this.getOrCreateWallet(userId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  CARD OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async getCard(userId: number): Promise<Card | null> {
    return this.cardRepo.findOne({ where: { userId } });
  }

  async addCard(userId: number, dto: CreateCardDto): Promise<Card> {
    // Only one card per user
    const existing = await this.cardRepo.findOne({ where: { userId } });
    if (existing) {
      throw new BadRequestException(
        'You already have a card. Remove it first to add a new one.',
      );
    }

    // Validate card number (16 digits)
    const cleanNumber = dto.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanNumber)) {
      throw new BadRequestException('Card number must be 16 digits');
    }

    // Validate expiry
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (
      dto.expiryMonth < 1 ||
      dto.expiryMonth > 12 ||
      dto.expiryYear < currentYear ||
      (dto.expiryYear === currentYear && dto.expiryMonth < currentMonth)
    ) {
      throw new BadRequestException(
        'Card has expired or expiry date is invalid',
      );
    }

    // Validate CVV (3 or 4 digits)
    if (!/^\d{3,4}$/.test(dto.cvv)) {
      throw new BadRequestException('CVV must be 3 or 4 digits');
    }

    // Validate cardholder name
    if (!dto.cardHolderName || dto.cardHolderName.trim().length < 2) {
      throw new BadRequestException('Cardholder name is required');
    }

    // Auto-detect card type from first digit
    const cardType = cleanNumber.startsWith('4') ? 'visa' : 'mastercard';

    const card = this.cardRepo.create({
      userId,
      last4: cleanNumber.slice(-4),
      cardHolderName: dto.cardHolderName.trim(),
      expiryMonth: dto.expiryMonth,
      expiryYear: dto.expiryYear,
      cvv: dto.cvv,
      cardType,
      balance: 0,
    });

    return this.cardRepo.save(card);
  }

  async deleteCard(userId: number): Promise<void> {
    const card = await this.cardRepo.findOne({ where: { userId } });
    if (!card) {
      throw new NotFoundException('No card found');
    }
    await this.cardRepo.remove(card);
  }

  async topUpCard(userId: number, dto: TopUpCardDto): Promise<Card> {
    if (dto.amount <= 0) {
      throw new BadRequestException('Top-up amount must be greater than 0');
    }
    if (dto.amount > 1_000_000) {
      throw new BadRequestException('Maximum top-up amount is 1,000,000');
    }

    const card = await this.cardRepo.findOne({ where: { userId } });
    if (!card) {
      throw new NotFoundException('No card found. Add a card first.');
    }

    card.balance = Number(card.balance) + Number(dto.amount);
    return this.cardRepo.save(card);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  DEPOSIT (from card → wallet)
  // ═══════════════════════════════════════════════════════════════════════════

  async deposit(userId: number, amount: number): Promise<Wallet> {
    if (amount <= 0)
      throw new BadRequestException('Deposit amount must be greater than 0');

    if (amount > 100000)
      throw new BadRequestException('Maximum deposit amount is 100,000');

    const wallet = await this.getOrCreateWallet(userId);

    // Card is required for deposit
    const card = await this.cardRepo.findOne({ where: { userId } });
    if (!card) {
      throw new BadRequestException(
        'No card found. Add a card before depositing.',
      );
    }

    if (Number(card.balance) < Number(amount)) {
      throw new BadRequestException(
        `Insufficient card balance. Available: $${Number(card.balance).toLocaleString()}`,
      );
    }

    // Folosim queryRunner pentru operații atomice
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Deduct from card
      card.balance = Number(card.balance) - Number(amount);
      await queryRunner.manager.save(card);

      // Add to wallet
      wallet.balance = Number(wallet.balance) + Number(amount);
      await queryRunner.manager.save(wallet);

      const transaction = this.transactionRepo.create({
        userId,
        amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        description: `Deposit of ${amount} RON from card ****${card.last4}`,
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return wallet;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── Transfer (Buyer → Seller) ─────────────────────────────────────────────

  async transfer(
    buyerId: number,
    sellerId: number,
    amount: number,
    referenceId: number,
    description: string,
  ): Promise<void> {
    const buyerWallet = await this.getOrCreateWallet(buyerId);
    const sellerWallet = await this.getOrCreateWallet(sellerId);

    if (Number(buyerWallet.balance) < Number(amount))
      throw new BadRequestException('Insufficient funds in wallet');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Scădem din buyer
      buyerWallet.balance = Number(buyerWallet.balance) - Number(amount);
      await queryRunner.manager.save(buyerWallet);

      // Adăugăm la seller
      sellerWallet.balance = Number(sellerWallet.balance) + Number(amount);
      await queryRunner.manager.save(sellerWallet);

      // Tranzacție buyer (payment)
      const paymentTx = this.transactionRepo.create({
        userId: buyerId,
        recipientId: sellerId,
        amount,
        type: TransactionType.PAYMENT,
        status: TransactionStatus.COMPLETED,
        description,
        referenceId,
      });
      await queryRunner.manager.save(paymentTx);

      // Tranzacție seller (refund invers — primire bani)
      const receiveTx = this.transactionRepo.create({
        userId: sellerId,
        recipientId: buyerId,
        amount,
        type: TransactionType.REFUND,
        status: TransactionStatus.COMPLETED,
        description: `Received payment: ${description}`,
        referenceId,
      });
      await queryRunner.manager.save(receiveTx);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── Get Transaction History ───────────────────────────────────────────────

  async getTransactions(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.transactionRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }
}
