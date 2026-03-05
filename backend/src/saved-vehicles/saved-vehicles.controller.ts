import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SavedVehiclesService } from './saved-vehicles.service';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';

@Controller('saved-vehicles')
export class SavedVehiclesController {
  constructor(private readonly savedVehiclesService: SavedVehiclesService) {}

  @Post(':vehicleId')
  @UseGuards(JwtAuthGuard)
  save(@Request() req, @Param('vehicleId', ParseIntPipe) vehicleId: number) {
    console.log('req.user:', req.user);
    return this.savedVehiclesService.save(req.user.userId, vehicleId);
  }

  @Delete(':vehicleId')
  @UseGuards(JwtAuthGuard)
  unsave(@Request() req, @Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.savedVehiclesService.unsave(req.user.userId, vehicleId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getSaved(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.savedVehiclesService.getSaved(req.user.userId, page, limit);
  }

  @Get('check/:vehicleId')
  @UseGuards(JwtAuthGuard)
  isSaved(@Request() req, @Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.savedVehiclesService.isSaved(req.user.userId, vehicleId);
  }
}
