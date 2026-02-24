import { Module } from '@nestjs/common';
import { SavedVehiclesService } from './saved-vehicles.service';
import { SavedVehiclesController } from './saved-vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedVehicle } from './entities/saved-vehicle.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedVehicle, Vehicle])],
  providers: [SavedVehiclesService],
  controllers: [SavedVehiclesController],
})
export class SavedVehiclesModule {}
