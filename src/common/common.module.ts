import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './app.config';
import { RequestLoggerMiddleware } from './middleware';
import { WrapResponseInterceptor } from './interceptors';
import { AuthGuard } from './guards';
import { ApplicationValidationPipe } from './pipes';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Auth, AuthSchema, RequestLogger, RequestLoggerSchema } from '../mongodb';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ENV: Joi.string().required(),
        PORT: Joi.number().default(3000),
        AUTH_KEY: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
        SALT_ROUNDS: Joi.number().required(),
        // jwtSecret: Joi.string().required(),
        // jwtAudience: Joi.string().required(),
        // jwtPrincipal: Joi.string().required(),
        // jwtTimeToLive: Joi.number().required(),
        // jwtRefreshTimeToLive: Joi.number().required(),
      }),
      load: [appConfig],
    }),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: RequestLogger.name, schema: RequestLoggerSchema },
    ]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
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
