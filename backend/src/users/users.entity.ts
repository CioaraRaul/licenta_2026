import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './enum/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Column({ nullable: true })
  bio?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
