import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
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
  _id: string;
  @Expose()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @Expose()
  permissions: TPermission[];
}
