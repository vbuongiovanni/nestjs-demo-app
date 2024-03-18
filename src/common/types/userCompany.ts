import { Types } from 'mongoose';

export type TUserCompany = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  companyId: Types.ObjectId;
  roleId: Types.ObjectId;
};
