import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InvalidatedRefreshTokenException } from 'src/common/exceptions';

@Injectable()
export class RefreshTokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async insert(userId: string, tokenId: string): Promise<void> {
    const key = this.getKey(userId);
    await this.cacheManager.set(key, tokenId, { ttl: 0 });
  }
  async validate(userId: string, tokenId: string): Promise<boolean> {
    const key = this.getKey(userId);
    const validId = await this.cacheManager.get(key);
    // if, hypothetically, the storeId is EVER undefined, it means that the token was already used.
    // Since this is a sign of a security breach, we can watch for this and take action.
    if (validId !== tokenId) {
      throw new InvalidatedRefreshTokenException();
    }
    return validId === tokenId;
  }
  async invalidate(userId: string): Promise<void> {
    await this.cacheManager.del(this.getKey(userId));
  }
  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
