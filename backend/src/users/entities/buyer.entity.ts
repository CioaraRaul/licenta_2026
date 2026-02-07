import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('buyers')
export class Buyer {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @Column({ type: 'text', default: 'EUR' })
  currency: string;

  @Column({ type: 'boolean', default: false })
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

  @Column({ type: 'boolean', default: true })
  receiveCarAlerts: boolean;

  @Column({ nullable: true })
  lastTransactionDate?: Date;
}
