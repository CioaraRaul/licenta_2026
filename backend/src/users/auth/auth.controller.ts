import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Res,
  Patch,
  Headers,
  BadRequestException,
  Delete,
  Query,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './services/auth.service';
import { LoginDTO } from './dtos/login.dto';
import { RefreshJWTAuthGuards } from './guards/refresh-token.guard';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { ResendVerificationEmailDto } from './dtos/resend-verification-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { VerifyResetTokenDto } from './dtos/verify-resetToken.dto';
import { DeleteAccountDto } from './dtos/delete-account.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async loginUser(@Body() loginDto: LoginDTO) {
    return this.authService.signIn(loginDto);
  }

  @UseGuards(RefreshJWTAuthGuards)
  @Post('refresh')
  async refreshTokens(
    @Request()
    req: ExpressRequest & { user: { sub: number; username: string } },
  ) {
    const userId = req.user.sub;
    const username = req.user.username;
    return this.authService.refreshTokens(userId, username);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req);
    const code = await this.authService.storeOAuthResult(result);
    const frontendUrl = this.configService.get(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    res.redirect(`${frontendUrl}/auth/callback?code=${code}`);
  }

  @Get('oauth/exchange')
  async exchangeOAuthCode(@Query('code') code: string) {
    return await this.authService.getOAuthResult(code);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Request() req, @Res() res: Response) {
    const result = await this.authService.facebookLogin(req);
    const code = await this.authService.storeOAuthResult(result);
    const frontendUrl = this.configService.get(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    res.redirect(`${frontendUrl}/auth/callback?code=${code}`);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPassword);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  async resendVerification(@Body() resendDto: ResendVerificationEmailDto) {
    return this.authService.resendVerificationEmail(resendDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    return this.authService.logout(req.user.userId, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      req.user.userId,
      changePasswordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-sessions')
  async revokeSessions(@Request() req) {
    return this.authService.revokeAllSessions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.userId);
  }

  @Post('verify-reset-token')
  async verifyResetToken(@Body() verifyResetTokenDto: VerifyResetTokenDto) {
    return this.authService.verifyResetToken(verifyResetTokenDto.token);
  }

  @Get('reset/exchange')
  async exchangeResetToken(@Query('code') code: string) {
    const resetToken = await this.authService.exchangeResetCode(code);
    return { resetToken };
  }

  @Get('verify/exchange')
  async exchangeVerificationCode(@Query('code') code: string) {
    const verificationToken =
      await this.authService.exchangeEmailVerifcationCode(code);
    return { verificationToken };
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('2fa/enable')
  // async enable2FA(@Request() req) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('2fa/verify')
  // async verify2FA(@Request() req, @Body() veify2FADto: Verify2FADto) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('2fa/disable')
  // async disable2FA(@Request() req, @Body() verify2FADto: Verify2FaDto) {}

  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  // @Post('2fa/validate')
  // async validate2FA(@Body() verify2FADto: Verify2FADto) {}

  @UseGuards(JwtAuthGuard)
  @Patch('account/deactivate')
  async deactivateAccount(@Request() req) {
    return await this.authService.deactivateAccount(req.user.userId);
  }

  @Post('account/reactivate')
  async reactivateAccount(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.reactivateAccountByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('account/reactivate')
  async reactivateAccountAuthenticated(@Request() req) {
    return this.authService.reactivateAccountByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Delete('account/delete')
  async deleteAccount(
    @Request() req,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return this.authService.deleteAccount(
      req.user.userId,
      deleteAccountDto.password,
    );
  }
}
