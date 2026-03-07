import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehicleStatus } from 'src/vehicles/enums/vehicle-status.enum';
import { BidStatus } from './enums/bid-status.enum';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepo: Repository<Bid>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async placeBid(
    buyerId: number,
    vehicleId: number,
    amount: number,
    message?: string,
  ): Promise<Bid> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (vehicle.sellerId === buyerId)
      throw new BadRequestException('Cannot bid on your own vehicle');

    // Vehiculul trebuie să fie disponibil
    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new BadRequestException('Vehicle is not available for bidding');
    }
    if (amount <= 0)
      // Bid-ul trebuie să fie mai mare ca 0
      throw new BadRequestException('Bid amount must be greater than 0');

    const existingBid = await this.bidRepo.findOne({
      where: { buyerId, vehicleId, status: BidStatus.PENDING },
    });

    if (existingBid)
      throw new BadRequestException(
        'You already have a pending bid on this vehicle. Withdraw it first.',
      );

    const bid = this.bidRepo.create({
      buyerId,
      vehicleId,
      amount,
      message,
      status: BidStatus.PENDING,
    });

    return this.bidRepo.save(bid);
  }

  async getVehicleBids(sellerId: number, vehicleId: number): Promise<Bid[]> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (vehicle.sellerId !== sellerId) {
      throw new ForbiddenException('Access denied');
    }

    return this.bidRepo.find({
      where: { vehicleId },
      relations: ['buyer'],
      order: { amount: 'DESC' },
    });
  }

  async getMyBids(
    buyerId: number,
    page: number,
    limit: number,
  ): Promise<{ data: Bid[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.bidRepo.findAndCount({
      where: { buyerId },
      relations: ['vehicle'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async acceptBid(sellerId: number, bidId: number): Promise<Bid> {
    const bid = await this.bidRepo.findOne({
      where: { id: bidId },
      relations: ['vehicle'],
    });
    if (!bid) throw new NotFoundException('Bid not found');

    // Doar seller-ul vehiculului poate accepta
    if (bid.vehicle.sellerId !== sellerId)
      throw new ForbiddenException('Access denied');

    if (bid.status !== BidStatus.PENDING)
      throw new BadRequestException('Only pending bids can be accepted');

    // Acceptăm bid-ul curent
    bid.status = BidStatus.ACCEPTED;
    await this.bidRepo.save(bid);

    // Respingem automat toate celelalte bids pending pe același vehicul
    await this.bidRepo
      .createQueryBuilder()
      .update(Bid)
      .set({ status: BidStatus.EXPIRED })
      .where('vehicleId = :vehicleId AND id != :bidId AND status = :status', {
        vehicleId: bid.vehicleId,
        bidId,
        status: BidStatus.PENDING,
      })
      .execute();

    // Marcăm vehiculul ca pending (rezervat)
    await this.vehicleRepo.update(bid.vehicleId, {
      status: VehicleStatus.PENDING,
    });

    return bid;
  }

  async rejectBid(
    sellerId: number,
    bidId: number,
    reason?: string,
  ): Promise<Bid> {
    const bid = await this.bidRepo.findOne({
      where: { id: bidId },
      relations: ['vehicle'],
    });

    if (!bid) throw new NotFoundException('bid not found');

    if (bid.vehicle.sellerId !== sellerId)
      throw new ForbiddenException('Access denied');

    if (bid.status !== BidStatus.PENDING)
      throw new BadRequestException('Only pending bids can be rejected');

    bid.status = BidStatus.REJECTED;
    bid.rejectionReason = reason;
    return this.bidRepo.save(bid);
  }

  // ─── Received Bids (Seller — all vehicles) ─────────────────────────────────

  async getReceivedBids(
    sellerId: number,
    page: number,
    limit: number,
    status?: BidStatus,
  ): Promise<{ data: Bid[]; total: number; page: number; limit: number }> {
    const qb = this.bidRepo
      .createQueryBuilder('bid')
      .innerJoinAndSelect('bid.vehicle', 'vehicle')
      .leftJoinAndSelect('bid.buyer', 'buyer')
      .where('vehicle.sellerId = :sellerId', { sellerId });

    if (status) {
      qb.andWhere('bid.status = :status', { status });
    }

    qb.orderBy('bid.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  // ─── Withdraw Bid (Buyer) ──────────────────────────────────────────────────

  async withdrawBid(buyerId: number, bidId: number): Promise<void> {
    const bid = await this.bidRepo.findOne({ where: { id: bidId } });
    if (!bid) throw new NotFoundException('Bid not found');

    if (bid.buyerId !== buyerId) throw new ForbiddenException('Access denied');

    if (bid.status !== BidStatus.PENDING)
      throw new BadRequestException('Only pending bids can be withdrawn');

    bid.status = BidStatus.WITHDRAWN;
    await this.bidRepo.save(bid);
  }
}
