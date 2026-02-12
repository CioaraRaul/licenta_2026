import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlackList } from '../entities/token-blacklist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(TokenBlackList)
    private tokenBlacklistRepo: Repository<TokenBlackList>,
  ) {}

  async blacklistToken(
    token: string,
    userId: number,
    expiresAt: Date,
  ): Promise<void> {
    const tokenBlacklist = this.tokenBlacklistRepo.create({
      token,
      userId,
      expiresAt,
    });
    await this.tokenBlacklistRepo.save(tokenBlacklist);
  }

  async isTokenBLacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.tokenBlacklistRepo.findOne({
      where: { token },
    });

    return !!blacklisted;
  }

  async removeExpiredTokens(): Promise<void> {
    await this.tokenBlacklistRepo
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }

  async blacklistAllUserTokens(userId: number): Promise<void> {
    await this.tokenBlacklistRepo.save({
      token: `revoke_all_${userId}`,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600000),
    });

    console.log(` All sessions revoked for user ${userId}`);
  }

  async areAllUserSessionsRevoked(
    userId: number,
    tokenIssuedAt: Date,
  ): Promise<boolean> {
    const revokeEntry = await this.tokenBlacklistRepo
      .createQueryBuilder('blacklist')
      .where('blacklist.userId = :userId', { userId })
      .andWhere('blacklist.token LIKE :tokenPattern', {
        tokenPattern: `revoke_all_${userId}%`,
      })
      .andWhere('blacklist.blacklistedAt > :tokenIssuedAt', { tokenIssuedAt })
      .getOne();

    return !!revokeEntry;
  }
}
