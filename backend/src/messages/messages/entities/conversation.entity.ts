import { User } from 'src/users/entities/users.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Message } from './message.entity';

// O singură conversație per buyer-seller-vehicle
@Unique(['buyerId', 'sellerId', 'vehicleId'])
@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @Column()
  buyerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @Column()
  sellerId: number;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column()
  vehicleId: number;

  // Numărul de mesaje necitite — util pentru badge-uri în UI
  @Column({ default: 0 })
  unreadCount: number;

  // Ultimul mesaj pentru preview în lista de conversații
  @Column({ nullable: true })
  lastMessage: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
