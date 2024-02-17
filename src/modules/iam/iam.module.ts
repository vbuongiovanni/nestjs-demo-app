import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';

@Module({})
export class IamModule {
  imports = [ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider())];
}
