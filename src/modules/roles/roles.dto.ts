import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ConvertIdType } from 'src/common/decorators';
import { TPermission } from 'src/common/types';
import { Types } from 'mongoose';

export class CreateRoleRequestDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  permissions: TPermission[];
}

export class UpdateRoleRequestDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  permissions: TPermission[];
}

export class RoleResponseDto {
  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  _id: string;

  @Expose()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Expose()
  permissions: TPermission[];
}

export class UserCompanyRoleResponseDto {
  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  _id: string;

  @IsNotEmpty()
  @Expose()
  @ConvertIdType('string')
  userId: string;

  @IsNotEmpty()
  @Expose()
  // WHY IS THIS CHANGING THE _ID!?!?!?!
  companyId: string;

  @Expose()
  isAccountOwner: boolean;

  @IsNotEmpty()
  @Expose()
  @ValidateNested()
  role: RoleResponseDto;
}
