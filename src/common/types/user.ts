import { Types } from 'mongoose';

export interface IUser {
  _id: string;
  companyId: string;
  name: string;
  email: string;
  password: string;
  role: Types.ObjectId;
}

export interface IActiveUser {
  companyId: Types.ObjectId;
}
