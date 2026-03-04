import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleType } from '../enums/vehicle-type.enum';
import { VehicleCondition } from '../enums/vehicle-condition.enum';
import { FuelType } from '../enums/fuel-type.enum';
import { Transmission } from '../enums/transmission.enum';

export class FilterVehicleDto {
  // Search & Filters
  @IsOptional()
  @IsString()
  search?: string; // Search in make, model, description

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  yearFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(new Date().getFullYear() + 1)
  yearTo?: number;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceTo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mileageFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mileageTo?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission;

  @IsOptional()
  @IsString()
  exteriorColor?: string;

  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // Sorting
  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'year' | 'mileage' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
