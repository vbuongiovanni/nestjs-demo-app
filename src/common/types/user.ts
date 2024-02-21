import { Types } from 'mongoose';

export interface IUser {
  _id: string;
  companyId: string;
  name: string;
  email: string;
  password: string;
  role: Types.ObjectId;
}
