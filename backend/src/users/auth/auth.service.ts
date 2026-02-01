import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDTO } from '../dtos/login.dto';

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

  async signIn(loginDto: LoginDTO) {
    const { username, email, password } = loginDto;

    const user = await this.usersService.findByUsernameOrEmail(username, email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}
