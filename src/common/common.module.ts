import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './config/app.config';
import { RequestLoggerMiddleware } from './middleware';
import { WrapResponseInterceptor } from './interceptors';
import { ApplicationValidationPipe } from './pipes';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RequestLogger, RequestLoggerSchema } from '../mongodb';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ENV: Joi.string().required(),
        PORT: Joi.number().default(3000),
        AUTH_KEY: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_HOST: Joi.string().default('localhost'),
      }),
      load: [appConfig],
    }),
    MongooseModule.forFeature([{ name: RequestLogger.name, schema: RequestLoggerSchema }]),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: WrapResponseInterceptor },
    { provide: APP_PIPE, useValue: ApplicationValidationPipe },
  ],
  exports: [ConfigModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
