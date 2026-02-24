import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './enums/transaction-type.enum';
import { TransactionStatus } from './enums/transaction-status.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    // DataSource pentru tranzacții atomice (deposit + transfer în același timp)
    private readonly dataSource: DataSource,
  ) {}

  // ─── Get or Create Wallet ──────────────────────────────────────────────────
  // Creează wallet automat dacă nu există

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

  // ─── Deposit ───────────────────────────────────────────────────────────────

  async deposit(userId: number, amount: number): Promise<Wallet> {
    if (amount <= 0)
      throw new BadRequestException('Deposit amount must be greater than 0');

    if (amount > 100000)
      throw new BadRequestException('Maximum deposit amount is 100,000');

    const wallet = await this.getOrCreateWallet(userId);

    // Folosim queryRunner pentru operații atomice
    // Dacă una din operații eșuează, totul se rollback-ează
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      wallet.balance = Number(wallet.balance) + Number(amount);
      await queryRunner.manager.save(wallet);

      const transaction = this.transactionRepo.create({
        userId,
        amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        description: `Deposit of ${amount} RON`,
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
  // Apelat când un bid e acceptat

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
