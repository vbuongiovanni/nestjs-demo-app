import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ToObjectIdPipe implements PipeTransform {
  transform(stringId: string, metadata: ArgumentMetadata) {
    return new Types.ObjectId(stringId);
  }
}
