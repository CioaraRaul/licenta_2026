import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}
}
