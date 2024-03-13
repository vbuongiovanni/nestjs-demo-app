import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ConvertIdType } from '../../common/decorators';
import { Types } from 'mongoose';
import { RoleResponseDto, UserCompanyRoleResponseDto } from '../roles/roles.dto';

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

  @IsOptional()
  isCompanyAdmin: boolean;
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
}
