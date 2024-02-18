import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export const redisConfig: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    store: redisStore,
    host: configService.get('redisHost'),
    port: configService.get('redisPort'),
    isGlobal: true,
  }),
  inject: [ConfigService],
};
