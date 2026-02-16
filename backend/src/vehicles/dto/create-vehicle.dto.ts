import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { VehicleType } from '../enums/vehicle-type.enum';
import { VehicleCondition } from '../enums/vehicle-condition.enum';
import { FuelType } from '../enums/fuel-type.enum';
import { Transmission } from '../enums/transmission.enum';
import { DriveType } from '../enums/drive-type.enum';

export class CreateVehicleDto {
  // BASIC INFO
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNotEmpty()
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsNotEmpty()
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsOptional()
  @IsString()
  trim?: string;

  // PRICING
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsBoolean()
  negotiable?: boolean;

  // MILEAGE & LOCATION
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  mileage: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  // ENGINE & PERFORMANCE
  @IsNotEmpty()
  @IsNumber()
  @Min(0.5)
  @Max(10)
  engineSize: number;

  @IsOptional()
  @IsString()
  engineType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  horsepower?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  torque?: number;

  @IsNotEmpty()
  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsNotEmpty()
  @IsEnum(Transmission)
  transmission: Transmission;

  @IsNotEmpty()
  @IsEnum(DriveType)
  driveType: DriveType;

  // EXTERIOR
  @IsNotEmpty()
  @IsString()
  exteriorColor: string;

  @IsOptional()
  @IsString()
  interiorColor?: string;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(6)
  doors?: number;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(9)
  seats?: number;

  // VIN & REGISTRATION
  @IsNotEmpty()
  @IsString()
  @Length(17, 17)
  vin: string;

  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  // FEATURES
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  safetyFeatures?: string[];

  // DESCRIPTION & MEDIA
  @IsNotEmpty()
  @IsString()
  @Length(10, 5000)
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  // HISTORY
  @IsOptional()
  @IsNumber()
  @Min(0)
  previousOwners?: number;

  @IsOptional()
  @IsBoolean()
  accidentHistory?: boolean;

  @IsOptional()
  @IsString()
  serviceHistory?: string;

  @IsOptional()
  @IsBoolean()
  warrantyAvailable?: boolean;

  @IsOptional()
  warrantyExpiryDate?: Date;

  // STATUS
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
