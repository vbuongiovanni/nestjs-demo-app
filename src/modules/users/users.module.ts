import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../mongodb';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), LoggerModule],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
})
export class UsersModule {}
