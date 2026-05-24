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

// O singură conversație per buyer-seller (peer-to-peer).
// vehicleId reflectă ultimul vehicul discutat — folosit pentru preview în sidebar.
@Unique(['buyerId', 'sellerId'])
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

  // Mesaje necitite per participant
  @Column({ default: 0 })
  unreadByBuyer: number;

  @Column({ default: 0 })
  unreadBySeller: number;

  // Alias-uri custom — fiecare participant poate redenumi cum vede cealaltă parte
  @Column({ type: 'text', nullable: true })
  aliasByBuyer?: string; // ce buyer-ul a setat ca nume pentru seller

  @Column({ type: 'text', nullable: true })
  aliasBySeller?: string; // ce seller-ul a setat ca nume pentru buyer

  // Câmp virtual — setat de service, nu e în DB
  unreadCount?: number;

  // Câmp virtual — alias-ul pe care utilizatorul curent l-a setat pentru cealaltă parte
  aliasForOther?: string | null;

  // Ultimul mesaj pentru preview în lista de conversații
  @Column({ nullable: true })
  lastMessage: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  // Cine a trimis ultimul mesaj — folosit pentru preview-ul „You sent" în sidebar
  @Column({ nullable: true })
  lastMessageSenderId?: number;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
