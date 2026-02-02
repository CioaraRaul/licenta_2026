import { ChildEntity, Column } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';
import { User } from './users.entity';

@ChildEntity(UserRole.ADMIN)
export class Admin extends User {
  @Column({ default: false })
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
