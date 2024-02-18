import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../../common/decorators/permissions.decorator';
import { IUser } from 'src/common/types/user';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const contextPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!contextPermissions) return true;
    const user: IUser = context.switchToHttp().getRequest().user;
    return contextPermissions.every((permission) => user.permissions.includes(permission));
  }
}
