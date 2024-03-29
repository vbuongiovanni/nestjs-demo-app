import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ConvertIdType } from '../../common/decorators';
import { Types } from 'mongoose';

export class CreateUserRequestDTO {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  password: string;
}

export class InviteUserRequestDTO {
  @IsNotEmpty()
  @ConvertIdType('objectId')
  companyId: Types.ObjectId;

  @IsNotEmpty()
  @ConvertIdType('objectId')
  roleId: Types.ObjectId;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CreateAccountUserDto {
  @IsNotEmpty()
  linkId: string;

  @IsNotEmpty()
  @ConvertIdType('objectId')
  companyId: Types.ObjectId;

  @IsNotEmpty()
  @ConvertIdType('objectId')
  roleId: Types.ObjectId;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  password: string;
}

export class RespondToInviteDTO {
  @IsNotEmpty()
  linkId: string;

  @IsNotEmpty()
  action: 'accept' | 'reject';
}

export class UpdateUserDTO {
  @Expose()
  @IsOptional()
  firstName: string;

  @Expose()
  @IsOptional()
  lastName: string;

  @Expose()
  @IsNotEmpty()
  phone: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsOptional()
  @ConvertIdType('objectId')
  roleId: Types.ObjectId;

  @Expose()
  @IsOptional()
  isAccountOwner: boolean;

  @Expose()
  @IsOptional()
  @ConvertIdType('objectId')
  companyId: Types.ObjectId;
}

export class UserResponseDTO {
  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  _id: string;

  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string', true)
  companies: string;

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

  @IsNotEmpty()
  @Expose()
  phone: string;
}
