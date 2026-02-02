import { ChildEntity, Column } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';
import { User } from './users.entity';

@ChildEntity(UserRole.GUEST)
export class Guest extends User {
  @Column({ nullable: true })
  guestSessionId?: string;

  @Column({ nullable: true })
  guestExpiresAt?: Date;

  @Column({ default: 0 })
  browsingHistory: number;

  @Column({ nullable: true, type: 'text' })
  viewedCarIds?: string;
}
