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
  companyId: Types.ObjectId;

  @Expose()
  @IsOptional()
  userId: Types.ObjectId;

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
