import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUser } from '../types';
import { Types } from 'mongoose';

export const ActiveUser = createParamDecorator((field: keyof IUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: IUser | undefined = request['user'];
  const token = user as unknown as { sub: string };
  const companies = user?.companies?.map((companyId) => new Types.ObjectId(companyId)) || [];
  const modifiedUser = { ...user, companies, userId: new Types.ObjectId(token.sub) };
  return field ? modifiedUser?.[field] : modifiedUser;
});
