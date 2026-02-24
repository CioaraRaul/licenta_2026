import { User } from 'src/users/entities/users.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['userId', 'vehicleId'])
@Entity('saved_vehicles')
export class SavedVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column()
  userId: number;

  @Column()
  vehicleId: number;

  @CreateDateColumn()
  savedAt: Date;
}
