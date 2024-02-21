import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { HashPasswordPipe } from '../../common/pipes/hash-password.pipe';
import { UsersService } from './users.service';
import { CreateUserRequestDTO, UpdateUserRequestDTO, UserResponseDTO } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ObjectIdParam, ReqAuthType } from 'src/common/decorators';
import { AuthType } from 'src/common/types';

@Controller('users')
@ReqAuthType(AuthType.Bearer)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(HashPasswordPipe)
  async createUser(@Body() createUserBody: CreateUserRequestDTO): Promise<UserResponseDTO> {
    const newUser = await this.usersService.createUser(createUserBody);
    return plainToInstance(UserResponseDTO, newUser, { excludeExtraneousValues: true });
  }

  @Get()
  async findAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.usersService.findAllUsers();
    return plainToInstance(UserResponseDTO, users, { excludeExtraneousValues: true });
  }

  @Get(':id')
  async findUser(@ObjectIdParam('id') id: Types.ObjectId): Promise<UserResponseDTO> {
    const user = await this.usersService.findUser(id);
    return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  async updateUser(
    @ObjectIdParam('id') id: Types.ObjectId,
    @Body() updateUserBody: Partial<UpdateUserRequestDTO>,
  ): Promise<UserResponseDTO> {
    const updatedUser = this.usersService.updateUser(id, updateUserBody);
    return plainToInstance(UserResponseDTO, updatedUser, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  async removeUser(@ObjectIdParam('id') id: Types.ObjectId): Promise<UserResponseDTO> {
    const removedUser = await this.usersService.removeUser(id);
    return plainToInstance(UserResponseDTO, removedUser, { excludeExtraneousValues: true });
  }
}
