import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VehicleType } from '../enums/vehicle-type.enum';
import { VehicleCondition } from '../enums/vehicle-condition.enum';
import { FuelType } from '../enums/fuel-type.enum';
import { Transmission } from '../enums/transmission.enum';
import { DriveType } from '../enums/drive-type.enum';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { User } from 'src/users/entities/users.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  // ========== BASIC INFO ==========
  @Column()
  make: string; // BMW, Mercedes, Toyota

  @Column()
  model: string; // M5, E-Class, Camry

  @Column()
  year: number; // 2023

  @Column({ type: 'text', enum: VehicleType })
  type: VehicleType;

  @Column({ type: 'text', enum: VehicleCondition })
  condition: VehicleCondition;

  @Column({ nullable: true })
  trim?: string; // Competition, AMG, Hybrid

  // ========== PRICING ==========
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice?: number; // For discounts

  @Column({ default: false })
  negotiable: boolean;

  // ========== MILEAGE & LOCATION ==========
  @Column({ type: 'int' })
  mileage: number; // in km or miles

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  zipCode?: string;

  // ========== ENGINE & PERFORMANCE ==========
  @Column({ type: 'decimal', precision: 4, scale: 1 })
  engineSize: number; // 2.0, 3.5, 5.0 (in liters)

  @Column({ nullable: true })
  engineType?: string; // V6, V8, Inline-4

  @Column({ type: 'int', nullable: true })
  horsepower?: number;

  @Column({ type: 'int', nullable: true })
  torque?: number; // Nm

  @Column({ type: 'text', enum: FuelType })
  fuelType: FuelType;

  @Column({ type: 'text', enum: Transmission })
  transmission: Transmission;

  @Column({ type: 'text', enum: DriveType })
  driveType: DriveType;

  // ========== EXTERIOR ==========
  @Column()
  exteriorColor: string; // Black, White, Red

  @Column({ nullable: true })
  interiorColor?: string;

  @Column({ type: 'int', default: 4 })
  doors: number;

  @Column({ type: 'int', default: 5 })
  seats: number;

  // ========== VIN & REGISTRATION ==========
  @Column({ unique: true })
  vin: string; // Vehicle Identification Number

  @Column({ nullable: true })
  licensePlate?: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  // ========== FEATURES & OPTIONS ==========
  @Column({ type: 'simple-array', nullable: true })
  features?: string[]; // ['Sunroof', 'Leather Seats', 'Navigation', 'Bluetooth']

  @Column({ type: 'simple-array', nullable: true })
  safetyFeatures?: string[]; // ['ABS', 'Airbags', 'Lane Assist']

  // ========== DESCRIPTION & MEDIA ==========
  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-array' })
  images: string[]; // URLs to images (Cloudinary, S3)

  @Column({ nullable: true })
  videoUrl?: string;

  // ========== HISTORY & DOCUMENTATION ==========
  @Column({ default: 1 })
  previousOwners: number;

  @Column({ default: false })
  accidentHistory: boolean;

  @Column({ type: 'text', nullable: true })
  serviceHistory?: string;

  @Column({ default: false })
  warrantyAvailable: boolean;

  @Column({ type: 'date', nullable: true })
  warrantyExpiryDate?: Date;

  // ========== STATUS & VISIBILITY ==========
  @Column({
    type: 'text',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus;

  @Column({ default: true })
  isActive: boolean; // Listing active/inactive

  @Column({ default: false })
  isFeatured: boolean; // Premium listing

  // ========== SELLER INFO (RELATION) ==========
  @Column()
  sellerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  // ========== ANALYTICS ==========
  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  @Column({ type: 'int', default: 0 })
  savesCount: number; // How many users saved it

  @Column({ type: 'int', default: 0 })
  contactsCount: number; // How many contacted seller

  // ========== TIMESTAMPS ==========
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
