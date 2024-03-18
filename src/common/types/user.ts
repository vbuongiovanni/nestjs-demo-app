import { Types } from 'mongoose';

export interface IUser {
  _id: string;
  companyId: string;
  roleId: string;
  email: string;
  password: string;
  companies?: Types.ObjectId[];
}

export interface IActiveUser {
  userId: Types.ObjectId;
  companyId: Types.ObjectId;
  roleId: Types.ObjectId;
  companies: Types.ObjectId[];
}
