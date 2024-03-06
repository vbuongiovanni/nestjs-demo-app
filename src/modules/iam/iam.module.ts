import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import jwtConfig from '../../common/config/jwt.config';
import { User, UserSchema } from '../../mongodb';
import { HashingService, BcryptService } from './authentication/hashing';
import { AuthService } from './authentication/services/authentication.service';
import { AuthController } from './authentication/authentication.controller';
import { CustomLogger } from 'src/logger/custom-logger.service';
import { RefreshTokenService } from './authentication/services/refresh-token.service';
import { redisConfig } from 'src/common/config/redis.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './authentication/guards';
import { BearerGuard } from './authentication/guards/bearer.guard';
import { AdminGuard } from './authentication/guards/admin.guard';
import { PermissionGuard } from './authorization/Permissions.guard';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.registerAsync(redisConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    JwtService,
    AuthService,
    CustomLogger,
    RefreshTokenService,
    BearerGuard,
    AdminGuard,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
  controllers: [AuthController],
})
export class IamModule {}
