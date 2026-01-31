import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dtos/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(createUserDto: CreateUserDto) {
    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    return await this.usersService.createUserAccount({
      ...createUserDto,
      password: result,
    });
  }
}
