import { ChildEntity, Column } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';
import { User } from './users.entity';

@ChildEntity(UserRole.BUYER)
export class Buyer extends User {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @Column({ type: 'text', default: 'EUR' })
  currency: string;

  @Column({ default: false })
  isWalletVerified: boolean;

  @Column({ nullable: true })
  bankAccountIBAN?: string;

  @Column({ nullable: true })
  bankAccountName?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ default: 0 })
  totalCarsBought: number;

  @Column({ nullable: true, type: 'text' })
  favoriteCarBrands?: string;

  @Column({ default: true })
  receiveCarAlerts: boolean;

  @Column({ nullable: true })
  lastTransactionDate?: Date;
}
