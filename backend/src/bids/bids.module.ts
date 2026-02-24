import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Vehicle])],
  providers: [BidsService],
  controllers: [BidsController],
})
export class BidsModule {}
