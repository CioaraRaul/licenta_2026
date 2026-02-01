import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { LoginDTO } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async loginUser(@Body() loginDto: LoginDTO) {
    return this.authService.signIn(loginDto);
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
