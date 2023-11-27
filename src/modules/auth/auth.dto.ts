import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
  _id: string;

  @IsNotEmpty()
  @Expose()
  userId: string;

  @IsNotEmpty()
  @Expose()
  token: string;

  @IsNotEmpty()
  @Expose()
  expiration: Date;
}

export class AuthLogoutRequestDTO {
  @IsNotEmpty()
  userId: string;
}
