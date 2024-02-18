import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

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
}

export class AuthResponseDTO {
  @IsNotEmpty()
  @Expose()
  accessToken: string;

  @IsNotEmpty()
  @Expose()
  refreshToken: string;
}

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  refreshToken: string;
}
