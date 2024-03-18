import { Types } from 'mongoose';
export type TCompany = {
  _id: Types.ObjectId;
  name: string;
  accountOwner: Types.ObjectId;
};
