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
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from '../user.dto';

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
    describe('Given an authenticated user', () => {
      describe('when the user attempts to create a new user with a valid request body', () => {
        let newUserResponse: UserResponseDTO;
        beforeEach(async () => {
          newUserResponse = await usersController.createUser(createUserRequestBody);
        });

        it('then it should call the createUser method of the UsersService', async () => {
          expect(mockUserService.createUser).toHaveBeenCalledWith(createUserRequestBody);
        });

        it('then it should return the created user object', async () => {
          const expectedUserResponseDto = plainToInstance(UserResponseDTO, createUserStub(), { excludeExtraneousValues: true });
          expect(newUserResponse).toEqual(expectedUserResponseDto);
        });
      });
    });
  });

  describe('findAllUsers', () => {
    describe('Given an authenticated user', () => {
      describe('when the user attempts to fetch all users', () => {
        let findAllUsersResponse: UserResponseDTO[] = [];
        beforeEach(async () => {
          findAllUsersResponse = await usersController.findAllUsers();
        });

        it('then it should call the findAllUsers method of the UsersService', async () => {
          expect(mockUserService.findAllUsers).toHaveBeenCalledWith();
        });

        it('then it should return an array of all users', async () => {
          const expectedUserResponseDto = plainToInstance(UserResponseDTO, findAllUsersStub(), { excludeExtraneousValues: true });
          expect(findAllUsersResponse).toEqual(expectedUserResponseDto);
        });
      });
    });
  });

  describe('findUser', () => {
    describe('Given an authenticated user', () => {
      describe('when the user attempts to find a user with a valid userId', () => {
        let findUserResponse: UserResponseDTO;
        beforeEach(async () => {
          findUserResponse = await usersController.findUser(user1Id);
        });

        it('then it should call the findUser method of the UsersService', async () => {
          expect(mockUserService.findUser).toHaveBeenCalledWith(user1Id);
        });

        it('then it should return the found user', async () => {
          const expectedUserResponseDto = plainToInstance(UserResponseDTO, findUserStub(), { excludeExtraneousValues: true });
          expect(findUserResponse).toEqual(expectedUserResponseDto);
        });
      });
    });
  });

  describe('updateUser', () => {
    describe('Given an authenticated user', () => {
      describe('when the user attempts to update a user with a valid updateUser request body and userId', () => {
        let updateUserResponse: UserResponseDTO;
        beforeEach(async () => {
          updateUserResponse = await usersController.updateUser(user1Id, updateUserRequestBody);
        });

        it('then it should call the updateUser method of the UsersService', async () => {
          expect(mockUserService.updateUser).toHaveBeenCalledWith(user1Id, updateUserRequestBody);
        });

        it('then it should return the updatedUser user', async () => {
          const expectedUserResponseDto = plainToInstance(UserResponseDTO, updateUserStub(), { excludeExtraneousValues: true });
          expect(updateUserResponse).toEqual(expectedUserResponseDto);
        });
      });
    });
  });

  describe('removeUser', () => {
    describe('Given an authenticated user', () => {
      describe('when the user attempts to remove a user with a valid userId', () => {
        let removeUserResponse: UserResponseDTO;
        beforeEach(async () => {
          removeUserResponse = await usersController.removeUser(user1Id);
        });

        it('then it should call the removeUser method of the UsersService', async () => {
          expect(mockUserService.removeUser).toHaveBeenCalledWith(user1Id);
        });

        it('then it should return the removed user', async () => {
          const expectedUserResponseDto = plainToInstance(UserResponseDTO, removeUserStub(), { excludeExtraneousValues: true });
          expect(removeUserResponse).toEqual(expectedUserResponseDto);
        });
      });
    });
  });
});
