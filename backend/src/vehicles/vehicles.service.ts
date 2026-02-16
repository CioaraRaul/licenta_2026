import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleStatus } from './enums/vehicle-status.enum';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { waitForDebugger } from 'inspector';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
  ) {}

  async create(
    createVehicleDto: CreateVehicleDto,
    sellerId: number,
  ): Promise<Vehicle> {
    const vehicle = this.vehicleRepo.create({
      ...createVehicleDto,
      sellerId,
      status: VehicleStatus.AVAILABLE,
      isActive: true,
    });

    const savedVehicle = await this.vehicleRepo.save(vehicle);
    console.log(
      `Vehicle created: ${savedVehicle.make} ${savedVehicle.model} by seller ${sellerId}`,
    );

    return savedVehicle;
  }

  async findAll(filterDto: FilterVehicleDto) {
    const {
      search,
      make,
      model,
      yearFrom,
      yearTo,
      type,
      condition,
      priceFrom,
      priceTo,
      mileageFrom,
      mileageTo,
      city,
      country,
      fuelType,
      transmission,
      exteriorColor,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const query = this.vehicleRepo
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.seller', 'seller')
      .where('vehicle.isActive = :isActive')
      .andWhere('vehicle.status = :status', {
        status: VehicleStatus.AVAILABLE,
      });

    if (search) {
      query.andWhere(
        '(vehicle.make LIKE :search OR vehicle.model LIKE :search OR vehicle.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (make) {
      query.andWhere('vehicle.make = :make', { make });
    }

    if (model) {
      query.andWhere('vehicle.model = :model', { model });
    }

    if (yearFrom) {
      query.andWhere('vehicle.year >= :yearFrom', { yearFrom });
    }

    if (yearTo) {
      query.andWhere('vehicle.year <= :yearTo ', { yearTo });
    }

    if (type) {
      query.andWhere('vehicle.type = :type', { type });
    }

    if (condition) {
      query.andWhere('vehicle.condition = :condition', { condition });
    }

    if (priceFrom) {
      query.andWhere('vehicle.price >= :priceFrom', { priceFrom });
    }

    if (priceTo) {
      query.andWhere('vehicle.price <= :priceTo', { priceTo });
    }

    if (mileageFrom) {
      query.andWhere('vehicle.mileage >= :mileageFrom', { mileageFrom });
    }

    if (mileageTo) {
      query.andWhere('vehicle.mileage <= :mileageTo', { mileageTo });
    }

    if (city) {
      query.andWhere('vehicle.city = :city', { city });
    }

    if (country) {
      query.andWhere('vehicle.country = :country', { country });
    }

    if (fuelType) {
      query.andWhere('vehicle.fuelType = :fuelType', { fuelType });
    }

    if (transmission) {
      query.andWhere('vehicle.transmission = :transmission', { transmission });
    }

    if (exteriorColor) {
      query.andWhere('vehicle.exteriorColor = :exteriorColor', {
        exteriorColor,
      });
    }

    const allowedSortFields = ['price', 'year', 'mileage', 'createdAt'];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`vehicle.${sortField}`, sortOrder);

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [vehicles, total] = await query.getManyAndCount();

    return {
      vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    await this.vehicleRepo.increment({ id }, 'viewsCount', 1);

    return vehicle;
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
    userId: number,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    if (vehicle.sellerId !== userId) {
      throw new ForbiddenException('You can only update your own vehicles');
    }

    if (vehicle.status === VehicleStatus.SOLD) {
      throw new BadRequestException('Cannot update a sold vehicle');
    }

    Object.assign(vehicle, updateVehicleDto);

    const updatedVehicle = await this.vehicleRepo.save(vehicle);

    return updatedVehicle;
  }

  async remove(id: number, userId: number): Promise<void> {
    const vehicle = await this.findOne(id);

    if (vehicle.sellerId !== userId) {
      throw new ForbiddenException('You can only delete your own vehicles ');
    }

    await this.vehicleRepo.remove(vehicle);
    console.log(`Vehicle deleted : ${vehicle.make} ${vehicle.model}`);
  }

  async deactivate(id: number, userId: number): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    if (vehicle.sellerId !== userId) {
      throw new ForbiddenException('You can only deactivate your own vehicles');
    }

    vehicle.isActive = false;
    return await this.vehicleRepo.save(vehicle);
  }

  async reactivate(id: number, userId: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.sellerId !== userId) {
      throw new ForbiddenException(
        ' You can only reactivate your own vehicles',
      );
    }

    vehicle.isActive = true;
    return this.vehicleRepo.save(vehicle);
  }

  async getMyListings(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [vehicles, total] = await this.vehicleRepo.findAndCount({
      where: { sellerId: userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsSold(id: number, userId: number): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    if (vehicle.sellerId !== userId) {
      throw new ForbiddenException(
        'You can only mark your own vehicles as sold',
      );
    }

    vehicle.status = VehicleStatus.SOLD;
    vehicle.isActive = false;

    return this.vehicleRepo.save(vehicle);
  }

  async getFeaturedVehicles(limit = 10): Promise<Vehicle[]> {
    return await this.vehicleRepo.find({
      where: {
        isFeatured: true,
        isActive: true,
        status: VehicleStatus.AVAILABLE,
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getSimilarVehicles(id: number, limit = 5): Promise<Vehicle[]> {
    const vehicle = await this.findOne(id);

    return this.vehicleRepo
      .createQueryBuilder('vehicle')
      .where('vehicle.id != :id', { id })
      .andWhere('vehicle.make = :make', { make: vehicle.make })
      .andWhere('vehicle.isActive = :isActive', { isActive: true })
      .andWhere('vehicle.status = :status', { status: VehicleStatus.AVAILABLE })
      .orderBy('ABS(vehicle.price - :price)', 'ASC')
      .setParameter('price', vehicle.price)
      .take(limit)
      .getMany();
  }
}
