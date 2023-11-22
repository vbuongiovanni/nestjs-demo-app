import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaName } from '../schema-names';
import { Types } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ collection: SchemaName.Auth })
export class Auth {
  @Prop({ required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, default: () => Date.now() + 1000 * 60 * 60 * 12 })
  expiration: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
