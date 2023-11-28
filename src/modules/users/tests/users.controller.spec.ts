import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';
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
import { UserDocument } from '../../../mongodb';

jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUserService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService, ConfigService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    mockUserService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let newUserResponse: UserDocument;
      beforeEach(async () => {
        newUserResponse = await mockUserService.createUser(createUserRequestBody);
      });

      it('should call the createUser method of the UsersService', async () => {
        expect(mockUserService.createUser).toHaveBeenCalledWith(createUserRequestBody);
      });

      it('should return the createUser method of the UsersService', async () => {
        expect(newUserResponse).toEqual(createUserStub());
      });
    });
  });

  describe('findAllUsers', () => {
    describe('when findAllUsers is called', () => {
      let findAllUsersResponse: UserDocument[] = [];
      beforeEach(async () => {
        findAllUsersResponse = await mockUserService.findAllUsers();
      });

      it('should call the findAllUsers method of the UsersService', async () => {
        expect(mockUserService.findAllUsers).toHaveBeenCalledWith();
      });

      it('should return an array of all users', async () => {
        expect(findAllUsersResponse).toEqual(findAllUsersStub());
      });
    });
  });

  describe('findUser', () => {
    describe('when findUser is called', () => {
      let findUserResponse: UserDocument;
      beforeEach(async () => {
        findUserResponse = await mockUserService.findUser(user1Id);
      });

      it('should call the findUser method of the UsersService', async () => {
        expect(mockUserService.findUser).toHaveBeenCalledWith(user1Id);
      });

      it('should return the found user', async () => {
        expect(findUserResponse).toEqual(findUserStub());
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let updateUserResponse: UserDocument;
      beforeEach(async () => {
        updateUserResponse = await mockUserService.updateUser(user1Id, updateUserRequestBody);
      });

      it('should call the updateUser method of the UsersService', async () => {
        expect(mockUserService.updateUser).toHaveBeenCalledWith(user1Id, updateUserRequestBody);
      });

      it('should return the updatedUser user', async () => {
        expect(updateUserResponse).toEqual(updateUserStub());
      });
    });
  });

  describe('removeUser', () => {
    describe('when removeUser is called', () => {
      let removeUserResponse: UserDocument;
      beforeEach(async () => {
        removeUserResponse = await mockUserService.removeUser(user1Id);
      });

      it('should call the removeUser method of the UsersService', async () => {
        expect(mockUserService.removeUser).toHaveBeenCalledWith(user1Id);
      });

      it('should return the removed user', async () => {
        expect(removeUserResponse).toEqual(removeUserStub());
      });
    });
  });
});
