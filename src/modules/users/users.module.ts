import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema, Invite, InviteSchema, Role, RoleSchema, User, UserSchema } from '../../mongodb';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from '../../logger/logger.module';
import { UserCompanies, UserCompaniesSchema } from 'src/mongodb/schemas/user-companies';
import { InvitesService } from '../invites/invites.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invite.name, schema: InviteSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Company.name, schema: CompanySchema },
      { name: UserCompanies.name, schema: UserCompaniesSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, InvitesService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}
