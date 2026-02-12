import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('admins')
export class Admin {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @Column({ nullable: true, type: 'text' })
  adminPermissions?: string;

  @Column({ nullable: true })
  lastAdminAction?: Date;

  @Column({ default: 0 })
  totalUsersManaged: number;

  @Column({ default: 0 })
  totalListingsModerated: number;

  @Column({ default: 0 })
  totalBannedUsers: number;

  @Column({ default: 0 })
  totalReportsHandled: number;
}
