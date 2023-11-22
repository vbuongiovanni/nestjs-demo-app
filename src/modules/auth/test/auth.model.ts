import { Model } from 'mongoose';
import { authDocument } from './auth.stub';

export type MockModel<T> = Partial<Record<keyof Model<T>, jest.Mock>>;
/* eslint-disable  @typescript-eslint/no-explicit-any */
type TMockData = Record<string, any>;

class MockSavedDocument {
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

export class MockAuthModel {
  constructor(private data: MockSavedDocument) {}
  save = jest.fn().mockResolvedValue(new MockSavedDocument(authDocument()));
  static findOne = jest.fn().mockResolvedValue({});
  static findOneAndDelete = jest.fn().mockResolvedValue({});
}

export class MockUserModel {
  constructor(private data: MockSavedDocument) {}
  static findOne = jest.fn().mockResolvedValue({});
}
