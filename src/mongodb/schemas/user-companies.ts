import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SchemaName } from '../schema-names';

export type UserCompaniesDocument = HydratedDocument<UserCompanies>;

@Schema({ collection: SchemaName.UserCompanies })
export class UserCompanies {
  @Prop()
  companyId: Types.ObjectId;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  roleId: Types.ObjectId;

  @Prop({ required: true, default: false })
  isAccountOwner: boolean;
}

export const UserCompaniesSchema = SchemaFactory.createForClass(UserCompanies);
