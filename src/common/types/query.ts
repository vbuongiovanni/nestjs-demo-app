import { Types } from 'mongoose';

export type TQuery =
  | { companyId: Types.ObjectId; _id?: Types.ObjectId }
  | { $and: [{ _id: Types.ObjectId }, { companyId: { $in: Types.ObjectId[] } }] }
  | { companyId: { $in: Types.ObjectId[] } };
