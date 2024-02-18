import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SchemaName } from '../schema-names';
import { TPermission } from '../../common/types';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ collection: SchemaName.Role })
export class Role {
  @Prop({ required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  Permissions: TPermission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
