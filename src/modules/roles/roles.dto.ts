import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ConvertIdType } from 'src/common/decorators';
import { TPermission } from 'src/common/types';

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
  @Expose()
  @ConvertIdType('string')
  _id: string;

  @Expose()
  @ConvertIdType('string')
  userId: string;

  @Expose()
  @ConvertIdType('string')
  companyId: string;

  @Expose()
  isAccountOwner: boolean;

  @Expose()
  @ValidateNested()
  role: RoleResponseDto;
}
