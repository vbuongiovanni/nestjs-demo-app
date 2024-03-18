import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Validate, ValidateNested } from 'class-validator';
import { ConvertIdType } from 'src/common/decorators';
import { Types } from 'mongoose';

export class RegisterRequestDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(10, 25)
  password: string;
}

export class RegisterResponseDTO {
  @IsNotEmpty()
  @Expose()
  _id: string;

  @IsNotEmpty()
  @Expose()
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
}

export class AuthRequestDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @ConvertIdType('objectId')
  activeCompanyId: Types.ObjectId;
}

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthResponseDTO {
  @IsNotEmpty()
  @Expose()
  responseType: 'tokens';

  @IsNotEmpty()
  @Expose()
  accessToken: string;

  @IsNotEmpty()
  @Expose()
  refreshToken: string;
}

class Company {
  @Expose()
  @ConvertIdType('objectId')
  _id: Types.ObjectId;

  @Expose()
  name: string;
}

export class AuthCompanySelectionResponseDTO {
  @IsNotEmpty()
  @Expose()
  responseType: 'companySelection';

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Company)
  companies: Company[];
}
