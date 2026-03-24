import {
  Controller,
  Get,
  Post,
  Delete,
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
import type { CreateCardDto, TopUpCardDto } from './interfaces/card.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ─── Get My Wallet ─────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.userId);
  }

  // ─── Deposit (from card → wallet) ──────────────────────────────────────────

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  deposit(@Request() req, @Body('amount') amount: number) {
    if (!amount) throw new BadRequestException('Amount is required');
    return this.walletService.deposit(req.user.userId, amount);
  }

  // ─── Withdraw (from wallet → card) ────────────────────────────────────────

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  withdraw(@Request() req, @Body('amount') amount: number) {
    if (!amount) throw new BadRequestException('Amount is required');
    return this.walletService.withdraw(req.user.userId, amount);
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

  // ═══════════════════════════════════════════════════════════════════════════
  //  CARD ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  @Get('card')
  @UseGuards(JwtAuthGuard)
  getCard(@Request() req) {
    return this.walletService.getCard(req.user.userId);
  }

  @Post('card')
  @UseGuards(JwtAuthGuard)
  addCard(@Request() req, @Body() dto: CreateCardDto) {
    return this.walletService.addCard(req.user.userId, dto);
  }

  @Delete('card')
  @UseGuards(JwtAuthGuard)
  deleteCard(@Request() req) {
    return this.walletService.deleteCard(req.user.userId);
  }

  @Post('card/topup')
  @UseGuards(JwtAuthGuard)
  topUpCard(@Request() req, @Body() dto: TopUpCardDto) {
    return this.walletService.topUpCard(req.user.userId, dto);
  }
}
