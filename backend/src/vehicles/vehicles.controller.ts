import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
  DefaultValuePipe,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    return this.vehiclesService.create(createVehicleDto, req.user.userId);
  }

  @Get()
  findAll(@Query() filterDto: FilterVehicleDto) {
    return this.vehiclesService.findAll(filterDto);
  }

  @Get('featured')
  getFeatured(@Query('limit', ParseIntPipe) limit = 10) {
    return this.vehiclesService.getFeaturedVehicles(limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/listings')
  getMyListings(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 10,
  ) {
    return this.vehiclesService.getMyListings(req.user.userId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Get(':id/similar')
  getSimilar(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', ParseIntPipe) limit = 5,
  ) {
    return this.vehiclesService.getSimilarVehicles(id, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.deactivate(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/sold')
  markAsSold(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.markAsSold(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehiclesService.remove(id, req.user.userId);
  }
}
