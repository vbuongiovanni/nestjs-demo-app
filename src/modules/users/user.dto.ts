import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ConvertIdType } from '../../common/decorators';

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

export class CreateAccountOwnerRequestDTO {
  @IsNotEmpty()
  linkId: string;

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
  @ConvertIdType('string')
  companyId: string;

  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  roleId: string;

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

  @Expose()
  isCompanyAdmin: boolean;
}
