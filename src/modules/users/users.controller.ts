import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { HashPasswordPipe } from '../../common/pipes';
import { UsersService } from './users.service';
import { UserRequestDTO, UserResponseDTO } from './user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(HashPasswordPipe)
  async create(
    @Body() createUserDto: UserRequestDTO,
  ): Promise<UserResponseDTO> {
    const newUser = await this.usersService.create(createUserDto);
    return plainToInstance(UserResponseDTO, newUser);
  }

  @Get()
  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.usersService.findAll();
    return plainToInstance(UserResponseDTO, users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDTO> {
    const user = await this.usersService.findOne(+id);
    return plainToInstance(UserResponseDTO, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UserRequestDTO,
  ): Promise<UserResponseDTO> {
    const updatedUser = this.usersService.update(+id, updateUserDto);
    return plainToInstance(UserResponseDTO, updatedUser);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserResponseDTO> {
    const removedUser = await this.usersService.remove(+id);
    return plainToInstance(UserResponseDTO, removedUser);
  }
}
