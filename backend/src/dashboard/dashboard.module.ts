import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Bid } from '../bids/entities/bid.entity';
import { SavedVehicle } from '../saved-vehicles/entities/saved-vehicle.entity';
import { Transaction } from '../wallet/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Bid, SavedVehicle, Transaction]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
