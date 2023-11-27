import { userDocument, createUserStub, findAllUsersStub, findUserStub, updateUserStub, removeUserStub } from '../tests/users.stub';
import { MockModel, MockSavedDocument } from '../../../common/utils';
export { MockModel };
export class MockUserModel {
  constructor(private data: MockSavedDocument) {}
  save = jest.fn().mockResolvedValue(new MockSavedDocument(createUserStub()));
  static findOne = jest.fn().mockResolvedValue(findUserStub());
  static find = jest.fn().mockResolvedValue(findAllUsersStub());
  static findOneAndUpdate = jest.fn().mockResolvedValue(updateUserStub());
  static findOneAndDelete = jest.fn().mockResolvedValue(removeUserStub());
}
