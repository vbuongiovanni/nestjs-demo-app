import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

type TConversion = 'string' | 'objectId';

export function ConvertIdType(transformTo: TConversion, isArray?: boolean) {
  const conversionCallBack =
    transformTo == 'string' ? (objectId: Types.ObjectId) => objectId?.toString() : (stringId: string) => new Types.ObjectId(stringId);

  return (target: unknown, propertyKey: string) => {
    Transform((params) => {
      if (isArray) {
        const stringArray = Array.isArray(params.obj[propertyKey]) ? params.obj[propertyKey] : [params.obj[propertyKey]];
        return stringArray.map((id) => conversionCallBack(id));
      } else {
        return conversionCallBack(params.obj[propertyKey]);
      }
    })(target, propertyKey);
  };
}
