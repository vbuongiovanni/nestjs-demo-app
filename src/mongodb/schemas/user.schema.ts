import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaName } from '../schema-names';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: SchemaName.User })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true }) // , unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
