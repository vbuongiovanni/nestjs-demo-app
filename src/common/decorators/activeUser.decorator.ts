import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUser } from '../types';

export const ActiveUser = createParamDecorator((field: keyof IUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: IUser | undefined = request['user'];
  return field ? user?.[field] : user;
});
