import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleRequestDto, UpdateRoleRequestDto, RoleResponseDto, UserCompanyRoleResponseDto } from './roles.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ActiveUser, ReqAuthType } from 'src/common/decorators';
import { AuthType, IActiveUser, IUser } from 'src/common/types';
import { ObjectIdParam } from 'src/common/decorators';

@Controller('roles')
@ReqAuthType(AuthType.Bearer)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ReqAuthType(AuthType.Bearer)
  @ReqAuthType(AuthType.Admin)
  async createRole(@Body() createRoleBody: CreateRoleRequestDto): Promise<RoleResponseDto> {
    const newRole = await this.rolesService.createRole(createRoleBody);
    return plainToInstance(RoleResponseDto, newRole, { excludeExtraneousValues: true });
  }

  @Get('/userCompanyRoles')
  async findAllUserCompanyRoles(@ActiveUser() activeUser: IActiveUser): Promise<UserCompanyRoleResponseDto[]> {
    const { companyId } = activeUser;
    const userCompanyRoles = await this.rolesService.findAllUserCompanyRoles({ companyId: { $in: [companyId] } });
    return plainToInstance(UserCompanyRoleResponseDto, userCompanyRoles, { excludeExtraneousValues: true });
  }

  @Get('/userCompanyRoles/admin')
  @ReqAuthType(AuthType.Bearer)
  @ReqAuthType(AuthType.Admin)
  async findAllUserCompanyRolesAdmin(): Promise<UserCompanyRoleResponseDto[]> {
    const userCompanyRoles = await this.rolesService.findAllUserCompanyRolesAdmin();
    return plainToInstance(UserCompanyRoleResponseDto, userCompanyRoles, { excludeExtraneousValues: true });
  }

  @Get()
  async findAllRoles(): Promise<RoleResponseDto[]> {
    const allRoles = await this.rolesService.findAllRoles();
    return plainToInstance(RoleResponseDto, allRoles, { excludeExtraneousValues: true });
  }

  @Get(':roleId')
  async findRole(@ObjectIdParam('roleId') roleId: Types.ObjectId): Promise<RoleResponseDto> {
    const role = await this.rolesService.findRole(roleId);
    return plainToInstance(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  @Patch(':roleId')
  async updateRole(
    @ObjectIdParam('roleId') roleId: Types.ObjectId,
    @Body() updateRoleBody: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const updatedRole = this.rolesService.updateRole(roleId, updateRoleBody);
    return plainToInstance(RoleResponseDto, updatedRole, { excludeExtraneousValues: true });
  }

  @Delete(':roleId')
  async removeRole(@ObjectIdParam('roleId') roleId: Types.ObjectId): Promise<RoleResponseDto> {
    const removedRole = this.rolesService.removeRole(roleId);
    return plainToInstance(RoleResponseDto, removedRole, { excludeExtraneousValues: true });
  }
}
