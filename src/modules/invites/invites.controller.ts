import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteRequestDto, UpdateInviteRequestDto, InviteResponseDto } from './invites.dto';
import { plainToInstance } from 'class-transformer';
import { ActiveUser, ObjectIdParam, ReqAuthType } from 'src/common/decorators';
import { AuthType, IActiveUser } from 'src/common/types';
import { Types } from 'mongoose';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  async createInvite(@Body() createInviteBody: CreateInviteRequestDto) {
    const newInvite = await this.invitesService.createInvite(createInviteBody);
    return plainToInstance(InviteResponseDto, newInvite, { excludeExtraneousValues: true });
  }

  @Get()
  async findInvites(@ActiveUser() activeUser: IActiveUser) {
    const companies: Types.ObjectId[] = activeUser.companies || [];
    const invites = await this.invitesService.findAllInvites({ companies: { $in: companies } });
    return plainToInstance(InviteResponseDto, invites, { excludeExtraneousValues: true });
  }

  @Get('/admin')
  @ReqAuthType(AuthType.Bearer)
  @ReqAuthType(AuthType.Admin)
  async findAllInvitesAdmin() {
    const invites = await this.invitesService.findAllInvitesAdmin();
    return plainToInstance(InviteResponseDto, invites, { excludeExtraneousValues: true });
  }

  @Get('/:_id')
  async findInvite(@ActiveUser() activeUser: IActiveUser, @ObjectIdParam('_id') _id: Types.ObjectId) {
    const companies: Types.ObjectId[] = activeUser.companies || [];
    const invites = await this.invitesService.findInvite({ $and: [{ _id }, { companies: { $in: companies } }] });
    return plainToInstance(InviteResponseDto, invites, { excludeExtraneousValues: true });
  }

  @Patch('/:_id')
  async updateInvite(
    @ActiveUser() activeUser: IActiveUser,
    @ObjectIdParam('_id') _id: Types.ObjectId,
    @Body() updateInviteBody: UpdateInviteRequestDto,
  ) {
    const companies: Types.ObjectId[] = activeUser.companies || [];
    const updatedInvite = await this.invitesService.updateInvite({ $and: [{ _id }, { companies: { $in: companies } }] }, updateInviteBody);
    return plainToInstance(InviteResponseDto, updatedInvite, { excludeExtraneousValues: true });
  }

  @ReqAuthType(AuthType.Public)
  @Get('/:companyId/:link')
  async getInvite(@ObjectIdParam('companyId') companyId: Types.ObjectId, @Param('link') link: string) {
    const invite = await this.invitesService.findInvite({ companyId, link, status: 'pending' });
    return plainToInstance(InviteResponseDto, invite, { excludeExtraneousValues: true });
  }
}
