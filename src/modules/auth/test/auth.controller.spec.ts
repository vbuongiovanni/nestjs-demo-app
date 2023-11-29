import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { authLoginStub, authLogoutStub } from './auth.stub';
import { AuthRequestDTO, AuthResponseDTO } from '../auth.dto';

// with auto-mocking, all we need to do is point this to where the real real service is.
// Jest will automatically mock the service for us based on the __mocks__ dir.
// this is is done, Jest will automatically replace the real AuthService with the mock.
jest.mock('../auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: AuthService; // Note that this is the MOCK service, since we are testing the controller.

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    mockAuthService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    describe('Given a user that has a valid account', () => {
      describe('when the user attempts to logs in with valid credentials', () => {
        let authResponse: AuthResponseDTO;

        const loginBody: AuthRequestDTO = {
          email: 'someone@Somewhere.com',
          password: 'password',
        };

        beforeEach(async () => {
          authResponse = await authController.login(loginBody);
        });

        it('should call the login method of the AuthService', async () => {
          expect(mockAuthService.login).toHaveBeenCalledWith(loginBody);
        });

        it('should return the login method of the AuthService', async () => {
          expect(authResponse).toEqual(authLoginStub());
        });
      });
    });
  });

  describe('logout', () => {
    describe('Given a user that has a valid account and has logged in', () => {
      describe('When the user logs out with a valid body containing a valid userid', () => {
        let logoutResponse: Record<string, never>;

        const logoutBody = {
          userId: 'someUserId',
        };

        beforeEach(async () => {
          logoutResponse = await authController.logout(logoutBody);
        });

        it('should call the logout method of the AuthService', async () => {
          expect(mockAuthService.logout).toHaveBeenCalledWith(logoutBody);
        });

        it('should return an empty object', async () => {
          expect(logoutResponse).toEqual(authLogoutStub());
        });
      });
    });
  });
});
