import { createUserStub, findAllUsersStub, findUserStub, updateUserStub, removeUserStub } from '../tests/users.stub';

// note that this MUST be named the same as the class in the service, otherwise you will receive an erroneous error message stating that there is a circular dependency/
export const UsersService = jest.fn().mockReturnValue({
  createUser: jest.fn().mockResolvedValue(createUserStub()),
  findAllUsers: jest.fn().mockResolvedValue(findAllUsersStub()),
  findUser: jest.fn().mockResolvedValue(findUserStub()),
  updateUser: jest.fn().mockResolvedValue(updateUserStub()),
  removeUser: jest.fn().mockResolvedValue(removeUserStub()),
});
