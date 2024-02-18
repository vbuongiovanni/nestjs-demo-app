import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyRequestDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateCompanyRequestDto {
  @IsNotEmpty()
  name: string;
}

export class CompanyResponseDto {
  @IsNotEmpty()
  @Expose()
  _id: string;
  @Expose()
  @IsNotEmpty()
  name: string;
}
