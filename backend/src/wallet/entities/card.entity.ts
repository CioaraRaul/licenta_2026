import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export type CardType = 'visa' | 'mastercard';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  // Only last 4 digits stored for display
  @Column({ length: 4 })
  last4: string;

  @Column()
  cardHolderName: string;

  @Column()
  expiryMonth: number;

  @Column()
  expiryYear: number;

  @Column({ type: 'text', default: 'visa' })
  cardType: CardType;

  // Simulated card balance
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
