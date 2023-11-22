import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AuthRequestDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AuthResponseDTO {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  expiration: Date;
}

export class AuthLogoutRequestDTO {
  @IsNotEmpty()
  userId: string;
}
