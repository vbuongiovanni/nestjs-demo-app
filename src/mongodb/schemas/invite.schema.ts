import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SchemaName } from '../schema-names';

export type InviteDocument = HydratedDocument<Invite>;

@Schema({ collection: SchemaName.Invite })
export class Invite {
  @Prop({ required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
