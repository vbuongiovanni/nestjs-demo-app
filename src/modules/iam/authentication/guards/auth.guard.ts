import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from '../../../../common/types/authType';
import { BearerGuard } from './bearer.guard';
import { REQ_AUTH_TYPE_KEY } from '../../../../common/decorators/reqAuthType.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly bearerGuard: BearerGuard,
  ) {}

  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly guardTypeMap: Record<AuthType, CanActivate> = {
    [AuthType.Public]: { canActivate: () => true },
    [AuthType.Bearer]: this.bearerGuard,
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(REQ_AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) || [
      AuthGuard.defaultAuthType,
    ];
    const guards: CanActivate[] = [];

    authTypes.forEach((authType) => {
      const authTypeGuards = this.guardTypeMap[authType];
      guards.push(authTypeGuards);
    });
    let error = new UnauthorizedException();
    for (const guard of guards) {
      let canActivate: boolean;
      try {
        canActivate = (await guard.canActivate(context)) as boolean;
        if (canActivate) return true;
      } catch (ex) {
        error = ex;
        continue;
      }
      return false;
    }
    throw error;
  }
}
