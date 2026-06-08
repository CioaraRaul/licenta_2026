import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';
import { BidStatus } from './enums/bid-status.enum';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post(':vehicleId')
  @UseGuards(JwtAuthGuard)
  placeBid(
    @Request() req,
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Body('amount') amount: number,
    @Body('message') message?: string,
  ) {
    return this.bidsService.placeBid(
      req.user.userId,
      req.user.role,
      vehicleId,
      amount,
      message,
    );
  }

  @Get('received')
  @UseGuards(JwtAuthGuard)
  getReceivedBids(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: BidStatus,
  ) {
    return this.bidsService.getReceivedBids(
      req.user.userId,
      page,
      limit,
      status,
    );
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyBids(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.bidsService.getMyBids(req.user.userId, page, limit);
  }

  @Get('vehicle/:vehicleId')
  @UseGuards(JwtAuthGuard)
  getVehicleBids(
    @Request() req,
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
  ) {
    return this.bidsService.getVehicleBids(req.user.userId, vehicleId);
  }

  @Patch(':bidId/accept')
  @UseGuards(JwtAuthGuard)
  acceptBid(@Request() req, @Param('bidId', ParseIntPipe) bidId: number) {
    return this.bidsService.acceptBid(req.user.userId, bidId);
  }

  @Patch(':bidId/reject')
  @UseGuards(JwtAuthGuard)
  rejectBid(
    @Request() req,
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body('reason') reason?: string,
  ) {
    return this.bidsService.rejectBid(req.user.userId, bidId, reason);
  }

  @Patch(':bidId/withdraw')
  @UseGuards(JwtAuthGuard)
  withdrawBid(@Request() req, @Param('bidId', ParseIntPipe) bidId: number) {
    return this.bidsService.withdrawBid(req.user.userId, bidId);
  }

  @Delete(':bidId')
  @UseGuards(JwtAuthGuard)
  deleteBid(@Request() req, @Param('bidId', ParseIntPipe) bidId: number) {
    return this.bidsService.deleteBid(req.user.userId, bidId);
  }
}
