import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.update(req.user.userId, updateProfileDto);
  }
}
