import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
// import { HashPasswordPipe } from '../../common/pipes';
import { UsersService } from './users.service';
import { CreateUserRequestDTO, UpdateUserRequestDTO, UserResponseDTO } from './user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @UsePipes(HashPasswordPipe)
  async createUser(@Body() createUserBody: CreateUserRequestDTO): Promise<UserResponseDTO> {
    const newUser = await this.usersService.createUser(createUserBody);
    return plainToInstance(UserResponseDTO, newUser);
  }

  @Get()
  async findAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.usersService.findAllUsers();
    return plainToInstance(UserResponseDTO, users);
  }

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<UserResponseDTO> {
    const user = await this.usersService.findUser(+id);
    return plainToInstance(UserResponseDTO, user);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserBody: UpdateUserRequestDTO): Promise<UserResponseDTO> {
    const updatedUser = this.usersService.updateUser(+id, updateUserBody);
    return plainToInstance(UserResponseDTO, updatedUser);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<UserResponseDTO> {
    const removedUser = await this.usersService.removeUser(+id);
    return plainToInstance(UserResponseDTO, removedUser);
  }
}
