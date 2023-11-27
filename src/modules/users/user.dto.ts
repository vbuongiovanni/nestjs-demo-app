import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserRequestDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserRequestDTO {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;
}

export class UserResponseDTO {
  @IsNotEmpty()
  @Expose()
  _id: Types.ObjectId;

  @IsNotEmpty()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
}
