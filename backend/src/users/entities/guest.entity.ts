import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('guests')
export class Guest {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  guestSessionId?: string;

  @Column({ nullable: true })
  guestExpiresAt?: Date;

  @Column({ default: 0 })
  browsingHistory: number;

  @Column({ nullable: true, type: 'text' })
  viewedCarIds?: string;
}
