import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleRequestDto, UpdateRoleRequestDto, RoleResponseDto } from './roles.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ReqAuthType } from 'src/common/decorators';
import { AuthType } from 'src/common/types';
import { ObjectIdParam } from 'src/common/decorators';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() createRoleBody: CreateRoleRequestDto): Promise<RoleResponseDto> {
    const newRole = await this.rolesService.createRole(createRoleBody);
    return plainToInstance(RoleResponseDto, newRole, { excludeExtraneousValues: true });
  }

  @Get()
  async findAllRoles(): Promise<RoleResponseDto[]> {
    const allRoles = await this.rolesService.findAllRoles();
    return plainToInstance(RoleResponseDto, allRoles, { excludeExtraneousValues: true });
  }

  @Get(':id')
  @ReqAuthType(AuthType.Public)
  async findRole(@ObjectIdParam('id') id: Types.ObjectId): Promise<RoleResponseDto> {
    const role = await this.rolesService.findRole(id);
    return plainToInstance(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  async updateRole(@ObjectIdParam('id') id: Types.ObjectId, @Body() updateRoleBody: UpdateRoleRequestDto): Promise<RoleResponseDto> {
    const updatedRole = this.rolesService.updateRole(id, updateRoleBody);
    return plainToInstance(RoleResponseDto, updatedRole, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  async removeRole(@ObjectIdParam('id') id: Types.ObjectId): Promise<RoleResponseDto> {
    const removedRole = this.rolesService.removeRole(id);
    return plainToInstance(RoleResponseDto, removedRole, { excludeExtraneousValues: true });
  }
}
