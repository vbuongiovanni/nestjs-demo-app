import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteRequestDto, UpdateInviteRequestDto, InviteResponseDto } from './invites.dto';
import { plainToInstance } from 'class-transformer';
import { ObjectIdParam, ReqAuthType } from 'src/common/decorators';
import { AuthType } from 'src/common/types';
import { Types } from 'mongoose';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  async createInvite(@Body() createInviteBody: CreateInviteRequestDto) {
    const newInvite = await this.invitesService.createInvite(createInviteBody);
    return plainToInstance(InviteResponseDto, newInvite);
  }

  @Get()
  async findInvites() {
    const invites = await this.invitesService.findAllInvites();
    return plainToInstance(InviteResponseDto, invites);
  }

  @ReqAuthType(AuthType.Public)
  @Get('/:companyId/:linkId')
  async findInvite(@ObjectIdParam('companyId') companyId: Types.ObjectId, @Param('linkId') linkId: string) {
    const invites = await this.invitesService.findInvite(companyId, linkId);
    return plainToInstance(InviteResponseDto, invites);
  }

  @Patch(':id')
  async updateInvite(@Param('id') id: string, @Body() updateInviteBody: UpdateInviteRequestDto) {
    const updatedInvite = await this.invitesService.updateInvite(id, updateInviteBody);
    return plainToInstance(InviteResponseDto, updatedInvite);
  }
}
