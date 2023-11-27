import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { User, UserDocument } from '../../../mongodb/schemas';
import { getModelToken } from '@nestjs/mongoose';
import { CustomLogger } from '../../../logger/custom-logger.service';
import { MockModel, MockUserModel } from './user.model';
import {
  createUserRequestBody,
  createUserStub,
  findAllUsersStub,
  findUserStub,
  removeUserStub,
  updateUserRequestBody,
  updateUserStub,
  user1Id,
} from './users.stub';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUserModel: MockModel<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getModelToken(User.name), useValue: MockUserModel }, CustomLogger],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    mockUserModel = module.get<MockModel<UserDocument>>(getModelToken(User.name));
  });

  describe('createUser', () => {
    describe('When a valid name, password, and valid/unique email are passed to createUser', () => {
      it('should return a new user object', async () => {
        mockUserModel.findOne.mockResolvedValueOnce(null);
        const newUser = await usersService.createUser(createUserRequestBody);
        expect(newUser).toEqual(createUserStub());
      });
    });

    describe('When a non-unique email is passed to createUser', () => {
      it('should throw an error', async () => {
        mockUserModel.findOne.mockResolvedValueOnce(findUserStub());
        try {
          const newUser = await usersService.createUser(createUserRequestBody);
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex.message).toEqual('User already exists');
        }
      });
    });
  });

  describe('findAllUsers', () => {
    describe('When findAllUsers is invoked', () => {
      it('should return an array of all users', async () => {
        mockUserModel.find.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(findAllUsersStub()),
        }));
        const allUsers = await usersService.findAllUsers();
        expect(allUsers).toEqual(findAllUsersStub());
      });
    });
  });

  describe('findUser', () => {
    describe('When a valid userId is passed to findUser', () => {
      it('should return the user object', async () => {
        mockUserModel.findOne.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(findUserStub()),
        }));
        const user = await usersService.findUser(user1Id);
        expect(user).toEqual(findUserStub());
      });
    });

    describe('When an invalid userId is passed to findUser', () => {
      it('should throw a NotFoundException and provide a "User not found" message', async () => {
        mockUserModel.findOne.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(null),
        }));
        try {
          const user = await usersService.findUser('123 fake id 123');
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex.message).toEqual('User not found');
        }
      });
    });
  });

  describe('updateUser', () => {
    describe('When a valid userId and userRequestUpdate object is passed to updateUser', () => {
      it('should return the user object', async () => {
        mockUserModel.findOneAndUpdate.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(updateUserStub()),
        }));
        const user = await usersService.updateUser(user1Id, updateUserRequestBody);
        expect(user).toEqual(updateUserStub());
      });
    });

    describe('When an invalid userId is passed to updateUser', () => {
      it('should throw a NotFoundException and provide a "User not found" message', async () => {
        mockUserModel.findOneAndUpdate.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(null),
        }));
        try {
          const user = await usersService.updateUser('123 fake id 123', updateUserRequestBody);
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex.message).toEqual('User not found');
        }
      });
    });
  });

  describe('removeUser', () => {
    describe('When a valid userId is passed to removeUser', () => {
      it('should return the removed user object', async () => {
        mockUserModel.findOneAndDelete.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(removeUserStub()),
        }));
        const user = await usersService.removeUser(user1Id);
        expect(user).toEqual(removeUserStub());
      });
    });

    describe('When an invalid userId is passed to updateUser', () => {
      it('should throw a NotFoundException and provide a "User not found" message', async () => {
        mockUserModel.findOneAndDelete.mockImplementationOnce(() => ({
          lean: jest.fn().mockReturnValue(null),
        }));
        try {
          const user = await usersService.removeUser('123 fake id 123');
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex.message).toEqual('User not found');
        }
      });
    });
  });
});
