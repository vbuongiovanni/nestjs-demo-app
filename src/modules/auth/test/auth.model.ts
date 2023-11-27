import { Model } from 'mongoose';
import { authDocument } from './auth.stub';
import { MockModel, MockSavedDocument } from '../../../common/utils';
export { MockModel };

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
