import { Model } from 'mongoose';
// import { userDocument } from './users.stub';

export type MockModel<T> = Partial<Record<keyof Model<T>, jest.Mock>>;
/* eslint-disable @typescript-eslint/no-explicit-any */
type TMockData = Record<string, any>;

export class MockSavedDocument {
  constructor(params: TMockData) {
    Object.entries(params).forEach(([key, value]) => {
      this[key] = value;
    });
  }
  toObject = () => {
    const object = { ...this };
    delete object.toObject;
    delete object.lean;
    return object;
  };
  lean = () => {
    const object = { ...this };
    delete object.toObject;
    delete object.lean;
    return object;
  };
}

// export class MockUserModel {
//   constructor(private data: MockSavedDocument) {}
//   save = jest.fn().mockResolvedValue(new MockSavedDocument(userDocument));
//   static findOne = jest.fn().mockResolvedValue({});
// }
