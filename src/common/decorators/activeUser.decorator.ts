import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUser } from '../types';
import { Types } from 'mongoose';

export const ActiveUser = createParamDecorator((field: keyof IUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: IUser | undefined = request['user'];
  const token = user as unknown as { sub: string };
  const modifiedUser = { ...user, companyId: new Types.ObjectId(user.companyId), userId: new Types.ObjectId(token.sub) };
  return field ? modifiedUser?.[field] : modifiedUser;
});
