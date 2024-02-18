import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaName } from '../schema-names';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ collection: SchemaName.Company })
export class Company {
  @Prop({ required: true, unique: true })
  name: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
