import { IsNotEmpty, IsOptional } from 'class-validator';
import { InviteType, InviteStatus } from '../../mongodb/schemas/invite.schema';
import { Types } from 'mongoose';
import { Expose, Transform } from 'class-transformer';
import { ConvertIdType } from 'src/common/decorators';

export class CreateInviteRequestDto {
  @IsNotEmpty()
  companyId: Types.ObjectId;

  @IsOptional()
  userId: Types.ObjectId;

  @IsNotEmpty()
  type: InviteType;
}

export class CreateWelcomeAboardInviteRequestDto {
  @IsNotEmpty()
  companyId: Types.ObjectId;

  @IsNotEmpty()
  type: InviteType;
}

export class UpdateInviteRequestDto {
  @IsOptional()
  userId: Types.ObjectId;

  @IsNotEmpty()
  status: InviteStatus;

  @IsNotEmpty()
  dateUpdated: Date;
}

export class InviteResponseDto {
  @Expose()
  @IsNotEmpty()
  @ConvertIdType('string')
  _id: string;

  @Expose()
  @IsNotEmpty()
  link: string;

  @Expose()
  @IsNotEmpty()
  @ConvertIdType('string')
  userId: Types.ObjectId;

  @Expose()
  @IsNotEmpty()
  @ConvertIdType('string')
  companyId: Types.ObjectId;

  @Expose()
  @IsOptional()
  fullName: string;

  @Expose()
  @IsOptional()
  companyName: string;

  @Expose()
  @IsOptional()
  email: string;

  @Expose()
  @IsNotEmpty()
  status: InviteStatus;

  @Expose()
  @IsNotEmpty()
  type: InviteType;

  @Expose()
  @IsNotEmpty()
  dateInvited: Date;

  @Expose()
  @IsNotEmpty()
  dateUpdated: Date;
}
