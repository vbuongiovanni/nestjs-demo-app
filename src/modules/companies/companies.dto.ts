import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { ConvertIdType } from 'src/common/decorators';
import { CreateUserRequestDTO } from '../users/user.dto';

export class UpdateCompanyRequestDto {
  @IsNotEmpty()
  name: string;
}

export class CreateCompanyRequestDto {
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CompanyResponseDto {
  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  _id: string;

  @Expose()
  @IsNotEmpty()
  name: string;
}

export class CreateCompanyResponseDto {
  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  _id: string;

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  @ValidateNested()
  accountOwner: CreateUserRequestDTO;
}
