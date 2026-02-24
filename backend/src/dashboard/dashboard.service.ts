import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Bid } from '../bids/entities/bid.entity';
import { SavedVehicle } from '../saved-vehicles/entities/saved-vehicle.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { VehicleStatus } from '../vehicles/enums/vehicle-status.enum';
import { BidStatus } from '../bids/enums/bid-status.enum';
import { TransactionType } from '../wallet/enums/transaction-type.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,

    @InjectRepository(Bid)
    private readonly bidRepo: Repository<Bid>,

    @InjectRepository(SavedVehicle)
    private readonly savedVehicleRepo: Repository<SavedVehicle>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  // ─── Seller Stats ──────────────────────────────────────────────────────────

  async getSellerStats(sellerId: number) {
    // Total listings per status
    const totalListings = await this.vehicleRepo.count({
      where: { sellerId },
    });

    const activeListings = await this.vehicleRepo.count({
      where: { sellerId, status: VehicleStatus.AVAILABLE },
    });

    const soldListings = await this.vehicleRepo.count({
      where: { sellerId, status: VehicleStatus.SOLD },
    });

    // Total views pe toate vehiculele seller-ului
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const viewsResult = await this.vehicleRepo
      .createQueryBuilder('vehicle')
      .select('SUM(vehicle.viewsCount)', 'totalViews')
      .where('vehicle.sellerId = :sellerId', { sellerId })
      .getRawOne();

    // Total bids primite pe vehiculele seller-ului
    const totalBidsReceived = await this.bidRepo
      .createQueryBuilder('bid')
      .innerJoin('bid.vehicle', 'vehicle')
      .where('vehicle.sellerId = :sellerId', { sellerId })
      .getCount();

    const pendingBids = await this.bidRepo
      .createQueryBuilder('bid')
      .innerJoin('bid.vehicle', 'vehicle')
      .where('vehicle.sellerId = :sellerId AND bid.status = :status', {
        sellerId,
        status: BidStatus.PENDING,
      })
      .getCount();

    // Revenue total (din tranzacții)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const revenueResult = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'totalRevenue')
      .where('transaction.userId = :sellerId AND transaction.type = :type', {
        sellerId,
        type: TransactionType.REFUND, // Seller primește ca REFUND în wallet
      })
      .getRawOne();

    return {
      listings: {
        total: totalListings,
        active: activeListings,
        sold: soldListings,
        pending: totalListings - activeListings - soldListings,
      },
      bids: {
        total: totalBidsReceived,
        pending: pendingBids,
      },
      views: {
        total: Number(viewsResult?.totalViews) || 0,
      },
      revenue: {
        total: Number(revenueResult?.totalRevenue) || 0,
      },
    };
  }

  // ─── Buyer Stats ───────────────────────────────────────────────────────────

  async getBuyerStats(buyerId: number) {
    // Total bids plasate
    const totalBids = await this.bidRepo.count({
      where: { buyerId },
    });

    const pendingBids = await this.bidRepo.count({
      where: { buyerId, status: BidStatus.PENDING },
    });

    const acceptedBids = await this.bidRepo.count({
      where: { buyerId, status: BidStatus.ACCEPTED },
    });

    // Total vehicule salvate
    const savedVehicles = await this.savedVehicleRepo.count({
      where: { userId: buyerId },
    });

    // Total cheltuit
    const spentResult = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'totalSpent')
      .where('transaction.userId = :buyerId AND transaction.type = :type', {
        buyerId,
        type: TransactionType.PAYMENT,
      })
      .getRawOne();

    return {
      bids: {
        total: totalBids,
        pending: pendingBids,
        accepted: acceptedBids,
        rejected: totalBids - pendingBids - acceptedBids,
      },
      saved: {
        total: savedVehicles,
      },
      spent: {
        total: Number(spentResult?.totalSpent) || 0,
      },
    };
  }

  // ─── Combined Stats (returnează în funcție de rol) ─────────────────────────

  async getStats(userId: number, role: string) {
    if (role === 'seller') {
      return {
        role: 'seller',
        stats: await this.getSellerStats(userId),
      };
    }

    return {
      role: 'buyer',
      stats: await this.getBuyerStats(userId),
    };
  }
}
