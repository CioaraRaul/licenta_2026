import { ChildEntity, Column } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';
import { User } from './users.entity';

@ChildEntity(UserRole.SELLER)
export class Seller extends User {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @Column({ type: 'text', default: 'RON' })
  currency: string;

  @Column({ default: false })
  isWalletVerified: boolean;

  @Column({ nullable: true })
  bankAccountIBAN?: string;

  @Column({ nullable: true })
  bankAccountName?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingBalance: number;

  @Column({ default: 0 })
  totalCarsSold: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  sellerRating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  companyRegistrationNumber?: string;

  @Column({ default: false })
  isVerifiedSeller: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 })
  commissionRate: number;

  @Column({ nullable: true })
  lastTransactionDate?: Date;
}
