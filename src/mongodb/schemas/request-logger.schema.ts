import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaName } from '../schema-names';

export type RequestLoggerDocument = HydratedDocument<RequestLogger>;

@Schema({ collection: SchemaName.RequestLogger })
export class RequestLogger {
  @Prop({ required: true })
  clientIp: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  statusCode: string;

  @Prop({ required: true })
  requestReceived: Date;

  @Prop({ required: true })
  responseTime: number;

  @Prop()
  authorization: string;

  @Prop()
  body: string;
}

export const RequestLoggerSchema = SchemaFactory.createForClass(RequestLogger);
