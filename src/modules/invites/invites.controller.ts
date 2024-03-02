import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteRequestDto, UpdateInviteRequestDto, InviteResponseDto } from './invites.dto';
import { plainToInstance } from 'class-transformer';

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

  @Get(':id')
  async findInvite(@Param('id') id: string) {
    const invites = await this.invitesService.findInvite(id);
    return plainToInstance(InviteResponseDto, invites);
  }

  @Patch(':id')
  async updateInvite(@Param('id') id: string, @Body() updateInviteBody: UpdateInviteRequestDto) {
    const updatedInvite = await this.invitesService.updateInvite(id, updateInviteBody);
    return plainToInstance(InviteResponseDto, updatedInvite);
  }
}
