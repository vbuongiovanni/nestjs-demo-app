import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IUser } from '../types';
import { Types } from 'mongoose';

export const ObjectIdParam = createParamDecorator((paramName: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const id = request.params[paramName];
  return id ? new Types.ObjectId(id) : undefined;
});
