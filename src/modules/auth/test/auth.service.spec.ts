import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import {
  User,
  Auth,
  AuthDocument,
  UserDocument,
} from '../../../mongodb/schemas';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { MockAuthModel, MockUserModel, MockModel } from './auth.model';
import {
  authDocument,
  authLogoutStub,
  userLoginBody,
  userLogoutBody,
} from './auth.stub';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

const saltRounds = 10;

describe('AuthService', () => {
  let authService: AuthService;
  let authModel: MockModel<AuthDocument>;
  let userModel: MockModel<UserDocument>;
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
      ],
    }).compile();

    mockFoundUser = {
      name: 'Test User',
      email: 'test@email.com',
      password: await bcrypt.hash(userLoginBody.password, saltRounds),
    };

    authService = module.get<AuthService>(AuthService);
    authModel = module.get<MockModel<AuthDocument>>(getModelToken(Auth.name));
    userModel = module.get<MockModel<UserDocument>>(getModelToken(User.name));
  });

  describe('login', () => {
    describe('When a user logs for the first time with a correct password', () => {
      it('should return an auth object', async () => {
        userModel.findOne.mockResolvedValueOnce(mockFoundUser);
        authModel.findOne.mockResolvedValueOnce(null);
        const auth = await authService.login(userLoginBody);
      });
    });

    describe('When a user logs for the the second or more time with a correct password', () => {
      it('should return an auth object', async () => {
        userModel.findOne.mockResolvedValueOnce(mockFoundUser);
        authModel.findOne.mockResolvedValueOnce(authDocument());
        const auth = await authService.login(userLoginBody);
      });
    });

    describe('When a user attempts to login with an incorrect password', () => {
      it('should throw the "UnauthorizedException" with custom message.', async () => {
        const incorrectUserLogin = {
          ...userLoginBody,
          password: 'something else',
        };

        userModel.findOne.mockResolvedValueOnce(mockFoundUser);
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

        userModel.findOne.mockResolvedValueOnce(null);
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
        authModel.findOneAndDelete.mockResolvedValueOnce(authDocument());
        const serviceValue = await authService.logout(userLogoutBody);
        expect(serviceValue).toEqual(authLogoutStub());
      });
    });

    describe('When a user attempts to log out and is not found within the auth collection', () => {
      it('should throw a "BadRequestException"', async () => {
        authModel.findOneAndDelete.mockResolvedValueOnce(null);
        try {
          const serviceValue = await authService.logout(userLogoutBody);
          expect(false).toBeTruthy();
        } catch (ex) {
          expect(ex).toBeInstanceOf(BadRequestException);
          expect(ex.message).toEqual('Invalid user.');
        }
      });
    });
  });
});
