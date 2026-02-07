import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dtos/Jwt.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { TokenBlacklistService } from '../services/token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token && (await this.authService.isTokenBlackListed(token))) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const tokenIssuedAt = new Date(payload.iat * 1000);
    if (
      await this.tokenBlacklistService.areAllUserSessionsRevoked(
        payload.sub,
        tokenIssuedAt,
      )
    ) {
      throw new UnauthorizedException(
        'All sessions have been revoked for this user',
      );
    }

    return { userId: payload.sub, username: payload.username };
  }
}
