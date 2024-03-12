import { Types } from 'mongoose';

export type TQuery =
  | { $and: [{ _id: Types.ObjectId }, { companies: { $in: Types.ObjectId[] } }] }
  | { companyId: { $in: Types.ObjectId[] } }
  | { companies: { $in: Types.ObjectId[] } }
  | { $and: [{ _id: Types.ObjectId }, { _id: { $in: Types.ObjectId[] } }] }
  | { _id: { $in: Types.ObjectId[] } };
