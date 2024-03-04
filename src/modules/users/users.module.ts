import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema, Invite, InviteSchema, Role, RoleSchema, User, UserSchema } from '../../mongodb';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invite.name, schema: InviteSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
})
export class UsersModule {}
