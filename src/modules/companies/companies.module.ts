import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema, Invite, InviteSchema } from 'src/mongodb';
import { CustomLogger } from 'src/logger/custom-logger.service';
import { EmailService } from '../email/email.service';
import { InvitesService } from '../invites/invites.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Invite.name, schema: InviteSchema },
    ]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CustomLogger, EmailService, InvitesService, ConfigService],
})
export class CompaniesModule {}
