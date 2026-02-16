import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleStatus } from './enums/vehicle-status.enum';

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

  findAll() {
    return `This action returns all vehicles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }
}
