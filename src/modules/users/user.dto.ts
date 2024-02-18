import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ConvertIdType } from '../../common/decorators';

export class CreateUserRequestDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserRequestDTO {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;
}

export class UserResponseDTO {
  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  _id: string;

  @IsNotEmpty()
  @Expose()
  firstName: string;

  @IsNotEmpty()
  @Expose()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
}
