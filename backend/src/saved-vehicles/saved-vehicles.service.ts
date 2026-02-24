import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedVehicle } from './entities/saved-vehicle.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Injectable()
export class SavedVehiclesService {
  constructor(
    @InjectRepository(SavedVehicle)
    private readonly savedVehicleRepo: Repository<SavedVehicle>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async save(userId: number, vehicleId: number): Promise<SavedVehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const existing = await this.savedVehicleRepo.findOne({
      where: { userId, vehicleId },
    });

    if (existing) throw new ConflictException('Vehicle already saved');

    const saved = this.savedVehicleRepo.create({ userId, vehicleId });
    await this.savedVehicleRepo.save(saved);

    await this.vehicleRepo.increment({ id: vehicleId }, 'savesCount', 1);
    return saved;
  }

  async unsave(userId: number, vehicleId: number): Promise<void> {
    const saved = await this.savedVehicleRepo.findOne({
      where: { userId, vehicleId },
    });

    if (!saved) throw new NotFoundException('Saved vehicle not found');

    await this.savedVehicleRepo.remove(saved);

    await this.vehicleRepo
      .createQueryBuilder()
      .update(Vehicle)
      .set({ savesCount: () => 'MAX(0, savesCount - 1)' })
      .where('id=:id', { id: vehicleId })
      .execute();
  }

  async getSaved(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{
    data: SavedVehicle[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.savedVehicleRepo.findAndCount({
      where: { userId },
      relations: ['vehicle'],
      order: { savedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async isSaved(
    userId: number,
    vehicleId: number,
  ): Promise<{ saved: boolean }> {
    const existing = await this.savedVehicleRepo.findOne({
      where: { userId, vehicleId },
    });
    return { saved: !!existing };
  }
}
