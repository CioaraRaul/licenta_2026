import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { UsersService } from '../../users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDTO } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../enum/user-role.enum';
import { FacebookUser, GoogleUser } from '../types/general-user-types';
import { OAuthService } from './oauth.service';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { EmailService } from './email.service';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { ResendVerificationEmailDto } from '../dtos/resend-verification-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlackList } from '../entities/token-blacklist.entity';
import { Repository } from 'typeorm';
import { TokenBlacklistService } from './token-blacklist.service';
import { isEmail } from 'class-validator';
import { ChangePasswordDto } from '../dtos/change-password.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private oauthService: OAuthService,
    private configService: ConfigService,
    private emailService: EmailService,
    @InjectRepository(TokenBlackList)
    private tokenBlackListRepo: Repository<TokenBlackList>,
    private tokenBlackListService: TokenBlacklistService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.createUserAccount({
      ...createUserDto,
      password: result,
    });

    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 3600000);

    await this.usersService.updateVerificationToken(
      user.id,
      verificationToken,
      verificationExpires,
    );

    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        verificationToken,
      );
    } catch (error) {
      console.error('FAiled to send verification email: ', error);
    }

    const tokens = await this.getTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified || false,
      },
      ...tokens,
      message:
        'Account created! Please check your email to verify your account.',
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    const user = await this.usersService.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.usersService.verifyUserEmail(user.id);

    console.log('Email verified successfully for user: ', user.email);

    return {
      message: 'Email verified successfully! You can now all features',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isEmailVerified: true,
      },
    };
  }

  async signIn(loginDto: LoginDTO) {
    const { username, email, password } = loginDto;

    const user = await this.usersService.findByUsernameOrEmail(username, email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified || false,
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.usersService.findByUsernameOrEmail(
      undefined,
      email,
    );

    if (!user) {
      return {
        message:
          'If your email is registered, you will receive a password reset link.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    await this.usersService.updateResetToken(
      user.id,
      resetToken,
      resetTokenExpires,
    );

    try {
      await this.emailService.sendResetPasswordEmail(email, resetToken);
    } catch (error) {
      console.error('Failed to send reset email: ', error);
      throw new BadRequestException('Failded to send reset email');
    }

    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    console.log('PASSWORD RESET REQUEST');
    console.log('Email:', email);
    console.log('Reset URL:', resetUrl);
    console.log('Token:', resetToken);
    console.log('Expires:', resetTokenExpires);

    return {
      message:
        'If your email is registered, you will receive a password reset link.',
      ...(this.configService.get('NODE_ENV') === 'development' && {
        dev: {
          resetUrl,
          resetToken,
        },
      }),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword } = resetPasswordDto;

    const user = await this.usersService.findByResetToken(resetToken);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.clearResetToken(user.id);

    console.log('Password reset successfully for user:', user.email);

    return {
      message: 'Password has been reset successfully',
    };
  }

  async resendVerificationEmail(
    resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    const { email } = resendVerificationEmailDto;

    const user = await this.usersService.findByUsernameOrEmail(
      undefined,
      email,
    );

    if (!user) {
      return {
        message:
          'If your email is reqistered, you will receive a verification link',
      };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 + 3600000);

    await this.usersService.updateVerificationToken(
      user.id,
      verificationToken,
      verificationExpires,
    );

    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email: ', error);
      throw new BadRequestException('Failed to send verification email');
    }

    console.log('verification send to', email);

    return {
      message: 'Verification email sent! Please check your inbox.',
      ...(this.configService.get('NODE_ENV') === 'development' && {
        dev: {
          verificationUrl: `${this.configService.get('FRONTEND_URL')}/auth/verify-email/${verificationToken}`,
          verificationToken,
        },
      }),
    };
  }

  async logout(userId: number, accessToken: string) {
    const decoded = this.jwtService.decode(accessToken) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000);

    await this.tokenBlackListService.blacklistToken(
      accessToken,
      userId,
      expiresAt,
    );

    console.log(` User ${userId} logged out successfully`);

    return {
      message: 'Logged out succesfully',
    };
  }

  async isTokenBlackListed(token: string): Promise<boolean> {
    const blackListed = await this.tokenBlackListRepo.findOne({
      where: { token },
    });

    return !!blackListed;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(currentPassword, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newSalt = randomBytes(8).toString('hex');
    const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;
    const newHashedPassword = newSalt + '.' + newHash.toString('hex');

    await this.usersService.updatePassword(user.id, newHashedPassword);

    console.log(`Password changed successfully for user ${user.email}`);

    return {
      message: 'Password changed successfully',
    };
  }

  async revokeAllSessions(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.tokenBlackListService.blacklistAllUserTokens(userId);

    console.log(`All sessions revoked for user ${user.email}`);

    return {
      message: 'All sessions revoked successfully',
    };
  }

  async getCurrentUser(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async verifyResetToken(token: string) {
    if (!token) {
      throw new BadRequestException('No token provided');
    }

    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      return {
        valid: false,
        message: 'Invalid or expired reset token',
      };
    }

    return {
      valid: true,
      message: 'Reset token is valid',
      email: user.email,
    };
  }
}
