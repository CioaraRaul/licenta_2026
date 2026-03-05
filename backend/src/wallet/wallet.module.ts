import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { Card } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, Card])],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService], // Export pentru BidsModule (transfer la accept bid)
})
export class WalletModule {}
