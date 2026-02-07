import { Module, Provider } from '@nestjs/common';
import { UsersModule } from '../users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';

import { FacebookStrategy } from './strategies/facebook.strategy';
import { OAuthService } from './services/oauth.service';
import { EmailService } from './services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlackList } from './entities/token-blacklist.entity';
import { TokenBlacklistService } from './services/token-blacklist.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([TokenBlackList]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    OAuthService,
    FacebookStrategy,
    EmailService,
    TokenBlacklistService,
  ] as Provider[],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
