import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { User, Auth, AuthDocument, UserDocument } from '../../../mongodb/schemas';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { MockAuthModel, MockUserModel, MockModel } from './auth.model';
import { authDocument, authLogoutStub, userLoginBody, userLogoutBody } from './auth.stub';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CustomLogger } from '../../../logger/custom-logger.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthModel: MockModel<AuthDocument>;
  let mockUserModel: MockModel<UserDocument>;
  let mockFoundUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
        {
          provide: getModelToken(Auth.name),
          useValue: MockAuthModel,
        },
        CustomLogger,
      ],
    }).compile();

    mockFoundUser = {
      name: 'Test User',
      email: 'test@email.com',
      password: await bcrypt.hash(userLoginBody.password, 10),
    };

    authService = module.get<AuthService>(AuthService);
    mockAuthModel = module.get<MockModel<AuthDocument>>(getModelToken(Auth.name));
    mockUserModel = module.get<MockModel<UserDocument>>(getModelToken(User.name));
  });

  describe('login', () => {
    describe('When a user logs for the first time with a correct password', () => {
      it('should return an auth object', async () => {
        mockUserModel.findOne.mockResolvedValueOnce(mockFoundUser);
        mockAuthModel.findOne.mockResolvedValueOnce(null);
        const auth = await authService.login(userLoginBody);
        expect(auth).toEqual(authDocument());
      });
    });

    describe('When a user logs for the the second or more time with a correct password', () => {
      it('should return an auth object', async () => {
        mockUserModel.findOne.mockResolvedValueOnce(mockFoundUser);
        mockAuthModel.findOne.mockResolvedValueOnce(authDocument());
        const auth = await authService.login(userLoginBody);
        expect(auth).toEqual(authDocument());
      });
    });

    describe('When a user attempts to login with an incorrect password', () => {
      it('should throw the "UnauthorizedException" with custom message.', async () => {
        const incorrectUserLogin = {
          ...userLoginBody,
          password: 'something else',
        };

        mockUserModel.findOne.mockResolvedValueOnce(mockFoundUser);
        try {
          await authService.login(incorrectUserLogin);
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex).toBeInstanceOf(UnauthorizedException);
          expect(ex.message).toEqual('Invalid user or incorrect credentials.');
        }
      });
    });

    describe('When a user attempts to login without an email', () => {
      it('should throw the "UnauthorizedException" with custom message.', async () => {
        const incorrectUserLogin = {
          ...userLoginBody,
          email: '',
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);
        try {
          await authService.login(incorrectUserLogin);
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex).toBeInstanceOf(UnauthorizedException);
          expect(ex.message).toEqual('Invalid user or incorrect credentials.');
        }
      });
    });
  });

  describe('logout', () => {
    describe('When a user attempts to log out and is found within the auth collection', () => {
      it('should return an empty object', async () => {
        mockAuthModel.findOneAndDelete.mockResolvedValueOnce(authDocument());
        const serviceValue = await authService.logout(userLogoutBody);
        expect(serviceValue).toEqual(authLogoutStub());
      });
    });

    describe('When a user attempts to log out and is not found within the auth collection', () => {
      it('should throw a "BadRequestException"', async () => {
        mockAuthModel.findOneAndDelete.mockResolvedValueOnce(null);
        try {
          await authService.logout(userLogoutBody);
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex).toBeInstanceOf(BadRequestException);
          expect(ex.message).toEqual('Invalid user.');
        }
      });
    });
  });
});
