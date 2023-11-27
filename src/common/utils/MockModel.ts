import { Model } from 'mongoose';

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
    return object;
  };
}
