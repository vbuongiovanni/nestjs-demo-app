import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';
import { createUserRequestBody, createUserStub } from './users.stub';
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
    describe('when user attempts to create a new account that does not already exist', () => {
      let newUserResponse: UserResponseDTO;
      beforeEach(async () => {
        newUserResponse = await mockUserService.createUser(createUserRequestBody);
      });

      it('should call the createUser method of the UsersService', async () => {
        expect(mockUserService.createUser).toHaveBeenCalledWith(createUserRequestBody);
      });

      it('should return the createUser method of the UsersService', async () => {
        console.log('newUserResponse', newUserResponse)
        expect(newUserResponse).toEqual(createUserStub());
      });
    });
  });
});
