// import { findAllUsersStub, findUserStub, updateUserStub, removeUserStub } from '../tests/users.stub';

export const UserService = jest.fn().mockReturnValue({
  createUser: jest.fn().mockResolvedValue({}),
  // findAllUsers: jest.fn().mockResolvedValue(findAllUsersStub()),
  // findUser: jest.fn().mockResolvedValue(findUserStub()),
  // updateUser: jest.fn().mockResolvedValue(updateUserStub()),
  // removeUser: jest.fn().mockResolvedValue(removeUserStub()),
});
