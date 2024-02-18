import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { redisConfig } from './common/config/redis.config';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CatsModule } from './modules/cats/cats.module';
import { IamModule } from './modules/iam/iam.module';
import { dbConfig } from './common/config/db.config';
import { CompaniesModule } from './modules/companies/companies.module';
import { RolesModule } from './modules/roles/roles.module';

// TO DO :
// Implement circuit breaker
// CRON Jobs
// EventEmitter
// IAM Module
// // authorization and authentication
// // roles-based system
// // google sign-in
// // 2fa system
// Aliased imports

@Module({
  imports: [
    CommonModule,
    CacheModule.registerAsync(redisConfig),
    MongooseModule.forRootAsync(dbConfig),
    LoggerModule,
    IamModule,
    UsersModule,
    CatsModule,
    CompaniesModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
