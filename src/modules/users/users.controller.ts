import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Req } from '@nestjs/common';
import { HashPasswordPipe } from '../../common/pipes/hash-password.pipe';
import { UsersService } from './users.service';
import {
  CreateAccountUserDto,
  CreateUserRequestDTO,
  InviteUserRequestDTO,
  RespondToInviteDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from './user.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ActiveUser, ObjectIdParam, ReqAuthType } from 'src/common/decorators';
import { AuthType, IActiveUser } from 'src/common/types';
import { UserCompanyRoleResponseDto } from '../roles/roles.dto';
import { InviteResponseDto } from '../invites/invites.dto';

@Controller('users')
@ReqAuthType(AuthType.Bearer)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/invite')
  async inviteUser(@ActiveUser() activeUser: IActiveUser, @Body() inviteUserBody: InviteUserRequestDTO): Promise<InviteResponseDto> {
    const { companyId } = activeUser;
    const newUser = await this.usersService.inviteUser(inviteUserBody, companyId);
    return plainToInstance(InviteResponseDto, newUser, { excludeExtraneousValues: true });
  }

  @Post('/invite/admin')
  async inviteUserAdmin(@Body() inviteUserBody: InviteUserRequestDTO): Promise<InviteResponseDto> {
    const companyId = inviteUserBody.companyId;
    const newUser = await this.usersService.inviteUser(inviteUserBody, companyId);
    return plainToInstance(InviteResponseDto, newUser, { excludeExtraneousValues: true });
  }

  @Patch('/invite/:inviteId')
  async respondToInvite(
    @ActiveUser() activeUser: IActiveUser,
    @ObjectIdParam('inviteId') inviteId: Types.ObjectId,
    @Body() respondToInvite: RespondToInviteDTO,
  ): Promise<UserResponseDTO> {
    const { userId } = activeUser;
    const newUser = await this.usersService.respondToInvite(inviteId, userId, respondToInvite);
    return plainToInstance(UserResponseDTO, newUser, { excludeExtraneousValues: true });
  }

  @Post('/register/:inviteId')
  @ReqAuthType(AuthType.Public)
  @UsePipes(HashPasswordPipe)
  async createCompanyUser(
    @ObjectIdParam('inviteId') inviteId: Types.ObjectId,
    @Body() createUserBody: CreateAccountUserDto,
  ): Promise<UserResponseDTO> {
    const newUser = await this.usersService.createCompanyUser(inviteId, createUserBody);
    return plainToInstance(UserResponseDTO, newUser, { excludeExtraneousValues: true });
  }

  @Post()
  @UsePipes(HashPasswordPipe)
  async createUser(@Body() createUserBody: CreateUserRequestDTO): Promise<UserResponseDTO> {
    const newUser = await this.usersService.createUser(createUserBody);
    return plainToInstance(UserResponseDTO, newUser, { excludeExtraneousValues: true });
  }

  @Get('/activeUser')
  async findActiveUser(@ActiveUser() activeUser: IActiveUser, @ObjectIdParam('_id') _id: Types.ObjectId) {
    const { userId, companyId } = activeUser;
    const { user, userCompanyRoles } = await this.usersService.findActiveUser({
      $and: [{ _id: userId }, { companies: { $in: [companyId] } }],
    });
    const userDto = plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
    const userCompanyRolesDto = plainToInstance(UserCompanyRoleResponseDto, userCompanyRoles, { excludeExtraneousValues: true });
    return { ...userDto, userCompanyRoles: userCompanyRolesDto };
  }

  @Get('/admin')
  @ReqAuthType(AuthType.Bearer)
  @ReqAuthType(AuthType.Admin)
  async findAllUsersAdmin(): Promise<UserResponseDTO[]> {
    const users = await this.usersService.findAllUsers();
    return plainToInstance(UserResponseDTO, users, { excludeExtraneousValues: true });
  }

  @Get()
  async findAllUsers(@ActiveUser() activeUser: IActiveUser): Promise<UserResponseDTO[]> {
    const { companyId } = activeUser;
    const users = await this.usersService.findAllUsers({ companies: { $in: [companyId] } }, companyId);
    return plainToInstance(UserResponseDTO, users, { excludeExtraneousValues: true });
  }

  @Get('/:_id')
  async findUser(@ActiveUser() activeUser: IActiveUser, @ObjectIdParam('_id') _id: Types.ObjectId): Promise<UserResponseDTO> {
    const { companyId } = activeUser;
    const user = await this.usersService.findUser({ $and: [{ _id }, { companies: { $in: [companyId] } }] });
    return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
  }

  @Patch('/:_id')
  async updateUser(
    @ActiveUser() activeUser: IActiveUser,
    @ObjectIdParam('_id') _id: Types.ObjectId,
    @Body() updateUserBody: UpdateUserDTO,
  ): Promise<UpdateUserDTO> {
    const { companyId } = activeUser;
    const updatedUser = this.usersService.updateUser(_id, updateUserBody, companyId);
    return plainToInstance(UpdateUserDTO, updatedUser, { excludeExtraneousValues: true });
  }

  @Patch('/:_id/admin')
  @ReqAuthType(AuthType.Bearer)
  @ReqAuthType(AuthType.Admin)
  async updateUserAdmin(@ObjectIdParam('_id') _id: Types.ObjectId, @Body() updateUserBody: UpdateUserDTO): Promise<UpdateUserDTO> {
    const companyId = updateUserBody.companyId;
    const updatedUser = await this.usersService.updateUser(_id, updateUserBody, companyId);
    return plainToInstance(UpdateUserDTO, updatedUser, { excludeExtraneousValues: true });
  }

  @Delete('/:_id')
  async removeUser(@ActiveUser() activeUser: IActiveUser, @ObjectIdParam('_id') _id: Types.ObjectId): Promise<UserResponseDTO> {
    const { companyId } = activeUser;
    await this.usersService.removeUser({ $and: [{ _id }, { companies: { $in: [companyId] } }] });
    return undefined;
  }
}
