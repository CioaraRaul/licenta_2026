import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { GeneralUser } from './types/general-user-types';
import { User } from '../entities/users.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UserRole } from '../enum/user-role.enum';

const scrypt = promisify(_scrypt);

@Injectable()
export class OAuthService {
  constructor(private usersService: UsersService) {}

  async handleSocialLogin(
    provider: 'google' | 'facebook',
    socialUser: GeneralUser,
  ): Promise<User> {
    let { email, firstName, lastName, facebookId } = socialUser;

    if (!email || email.trim() === '') {
      if (provider === 'facebook' && facebookId) {
        email = `${facebookId}@facebook.temp`;
      } else {
        throw new BadRequestException(`Email not provided by ${provider}`);
      }
    }

    let user = await this.usersService.findByUsernameOrEmail(undefined, email);

    if (!user) {
      const username = email.includes('@facebook.temp')
        ? `fb_${facebookId}_${Date.now()}`
        : email.split('@')[0] + '_' + Date.now();

      const randomPassword = randomBytes(32).toString('hex');
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(randomPassword, salt, 32)) as Buffer;
      const hashedPassword = salt + '.' + hash.toString('hex');

      user = await this.usersService.createUserAccount({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: UserRole.GUEST,
      });
    }

    return user;
  }
}
