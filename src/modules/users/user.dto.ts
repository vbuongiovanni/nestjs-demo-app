import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ConvertIdType } from '../../common/decorators';
import { RoleResponseDto } from '../roles/roles.dto';

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

  @IsOptional()
  isCompanyAdmin: boolean;
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
  @ValidateNested()
  role: RoleResponseDto;

  @Expose()
  isCompanyAdmin: boolean;
}
