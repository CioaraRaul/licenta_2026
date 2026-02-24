import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ─── Get Stats (auto-detectează rolul din token) ───────────────────────────

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Request() req) {
    return this.dashboardService.getStats(req.user.userId, req.user.role);
  }

  // ─── Seller Stats explicit ─────────────────────────────────────────────────

  @Get('stats/seller')
  @UseGuards(JwtAuthGuard)
  getSellerStats(@Request() req) {
    return this.dashboardService.getSellerStats(req.user.userId);
  }

  // ─── Buyer Stats explicit ──────────────────────────────────────────────────

  @Get('stats/buyer')
  @UseGuards(JwtAuthGuard)
  getBuyerStats(@Request() req) {
    return this.dashboardService.getBuyerStats(req.user.userId);
  }
}
