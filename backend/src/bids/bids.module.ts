import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Vehicle]), WalletModule],
  providers: [BidsService],
  controllers: [BidsController],
})
export class BidsModule {}
