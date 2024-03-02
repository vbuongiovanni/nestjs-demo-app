import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SchemaName } from '../schema-names';

export enum InviteType {
  welcomeAboard = 'welcomeAboard',
  companyToUser = 'companyToUser',
  userToCompany = 'userToCompany',
}

export enum InviteStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
  cancelled = 'cancelled',
}

export type InviteDocument = HydratedDocument<Invite>;

@Schema({ collection: SchemaName.Invite })
export class Invite {
  @Prop({ type: String, required: true })
  link: string;

  @Prop({ type: Types.ObjectId, required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: InviteStatus, default: InviteStatus.pending })
  status: InviteStatus;

  @Prop({ type: String, enum: InviteType, required: true })
  type: InviteType;

  @Prop({ type: Date, default: () => Date.now() })
  dateInvited: Date;

  @Prop({ type: Date, default: () => Date.now() })
  dateUpdated: Date;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
