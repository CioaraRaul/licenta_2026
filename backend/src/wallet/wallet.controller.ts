import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ─── Get My Wallet ─────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.userId);
  }

  // ─── Deposit ───────────────────────────────────────────────────────────────

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  deposit(@Request() req, @Body('amount') amount: number) {
    if (!amount) throw new BadRequestException('Amount is required');
    return this.walletService.deposit(req.user.userId, amount);
  }

  // ─── Get Transaction History ───────────────────────────────────────────────

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  getTransactions(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.walletService.getTransactions(req.user.userId, page, limit);
  }
}
