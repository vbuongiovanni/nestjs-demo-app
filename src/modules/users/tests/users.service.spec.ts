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
    describe('Given an authenticated user', () => {
      describe('When the user attempts to create a new user with a valid name, password, and valid/unique email', () => {
        it('then it should return a new user object', async () => {
          mockUserModel.findOne.mockResolvedValueOnce(null);
          const newUser = await usersService.createUser(createUserRequestBody);
          expect(newUser).toEqual(createUserStub());
        });
      });
      describe('When the user attempts to create a new user with non-unique email', () => {
        it('then it should throw a BadRequestException with a "User already exists" message', async () => {
          mockUserModel.findOne.mockResolvedValueOnce(findUserStub());
          try {
            const newUser = await usersService.createUser(createUserRequestBody);
            expect(false).toBeTruthy();
          } catch (ex) {
            expect(ex.status).toEqual(400);
            expect(ex.message).toEqual('User already exists');
          }
        });
      });
    });
  });

  describe('findAllUsers', () => {
    describe('Given an authenticated user', () => {
      describe('when the user attempts to fetch all users', () => {
        it('then it should return an array of all users', async () => {
          mockUserModel.find.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(findAllUsersStub()),
          }));
          const allUsers = await usersService.findAllUsers();
          expect(allUsers).toEqual(findAllUsersStub());
        });
      });
    });
  });

  describe('findUser', () => {
    describe('Given an authenticated user', () => {
      describe('When the user attempts to find a user with a valid userId', () => {
        it('then it should return the user object', async () => {
          mockUserModel.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(findUserStub()),
          }));
          const user = await usersService.findUser(user1Id);
          expect(user).toEqual(findUserStub());
        });
      });

      describe('When the user attempts to find a user with an invalid userId', () => {
        it('then it should throw a NotFoundException and provide a "User not found" message', async () => {
          mockUserModel.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(null),
          }));
          try {
            const user = await usersService.findUser('123 fake id 123');
            expect(false).toBeTruthy();
          } catch (ex) {
            expect(ex.status).toEqual(404);
            expect(ex.message).toEqual('User not found');
          }
        });
      });
    });
  });

  describe('updateUser', () => {
    describe('Given an authenticated user', () => {
      describe('When the user attempts to update a user with a valid userRequestUpdate body and valid userId', () => {
        it('then it should return the updated user object', async () => {
          mockUserModel.findOneAndUpdate.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(updateUserStub()),
          }));
          const user = await usersService.updateUser(user1Id, updateUserRequestBody);
          expect(user).toEqual(updateUserStub());
        });
      });

      describe('When the user attempts to update a user with a valid userRequestUpdate body and invalid userId', () => {
        it('then it should throw a NotFoundException and provide a "User not found" message', async () => {
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
  });

  describe('removeUser', () => {
    describe('Given an authenticated user', () => {
      describe('When the user attempts to remove a user with a valid userId', () => {
        it('then it should return the removed user object', async () => {
          mockUserModel.findOneAndDelete.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(removeUserStub()),
          }));
          const user = await usersService.removeUser(user1Id);
          expect(user).toEqual(removeUserStub());
        });
      });

      describe('When the user attempts to remove a user with an invalid userId', () => {
        it('then it should throw a NotFoundException and provide a "User not found" message', async () => {
          mockUserModel.findOneAndDelete.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue(null),
          }));
          try {
            const user = await usersService.removeUser('123 fake id 123');
            expect(false).toBeTruthy();
          } catch (ex) {
            expect(ex.status).toEqual(404);
            expect(ex.message).toEqual('User not found');
          }
        });
      });
    });
  });
});
