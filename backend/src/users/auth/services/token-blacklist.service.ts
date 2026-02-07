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
}
