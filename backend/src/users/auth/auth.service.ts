import { BadRequestException, Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDTO } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../enum/user-role.enum';
import { FacebookUser, GoogleUser } from './types/general-user-types';
import { OAuthService } from './oauth.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private oauthService: OAuthService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.createUserAccount({
      ...createUserDto,
      password: result,
    });

    const tokens = await this.getTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
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

    const tokens = await this.getTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  async getTokens(userId: string | number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username: username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username: username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
          expiresIn: '1h',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, username: string) {
    const tokens = await this.getTokens(userId, username);
    return tokens;
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new BadRequestException('No user from google');
    }

    const googleUser = req.user as GoogleUser;

    const { email, firstName, lastName } = googleUser;

    let user = await this.usersService.findByUsernameOrEmail(undefined, email);

    if (!user) {
      const username = email.split('@')[0] + '_' + Date.now();

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

    const tokens = await this.getTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async facebookLogin(req: any) {
    if (!req.user) {
      throw new BadRequestException('No user from Facebook');
    }

    const user = await this.oauthService.handleSocialLogin(
      'facebook',
      req.user,
    );

    const tokens = await this.getTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }
}
