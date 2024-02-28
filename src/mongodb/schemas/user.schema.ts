import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SchemaName } from '../schema-names';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: SchemaName.User })
export class User {
  @Prop({ required: true })
  companyId: Types.ObjectId;

  @Prop({ default: false })
  isCompanyAdmin: boolean;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
