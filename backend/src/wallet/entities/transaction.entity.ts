import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { User } from 'src/users/entities/users.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', enum: TransactionType })
  type: TransactionType;

  @Column({
    type: 'text',
    enum: TransactionStatus,
    default: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  // Descriere pentru istoricul tranzacției
  @Column({ nullable: true })
  description: string;

  // Referință externă (ex: ID bid, ID vehicul)
  @Column({ nullable: true })
  referenceId: number;

  // Cine a inițiat tranzacția
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  // Către cine s-au dus banii (pentru transferuri)
  @Column({ nullable: true })
  recipientId: number;

  @CreateDateColumn()
  createdAt: Date;
}
