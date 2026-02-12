import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('token_blacklist')
export class TokenBlackList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  blacklistedAt: Date;

  @Column()
  expiresAt: Date;
}
