import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { CatsModule } from './modules/cats/cats.module';

// TO DO :
// Implement circuit breaker
// CRON Jobs
// EventEmitter
// IAM Module
// // authorization and authentication
// // roles-based system
// // google sign-in
// // 2fa system

@Module({
  imports: [
    CommonModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
