import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from '../dtos/login.dto';
import { RefreshJWTAuthGuards } from './guards/refresh-token.guard';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

    res.redirect(
      `http://localhost:5173/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    // Implementation for forgot password functionality goes here
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // Implementation for reset password functionality goes here
  }
}
