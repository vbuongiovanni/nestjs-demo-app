import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { CustomLogger } from 'src/logger/custom-logger.service';
import { Invite, InviteSchema } from 'src/mongodb';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }])],
  controllers: [InvitesController],
  providers: [InvitesService, CustomLogger],
  exports: [InvitesService],
})
export class InvitesModule {}
