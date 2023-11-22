import { authLoginStub, authLogoutStub } from '../test/auth.stub';

export const AuthService = jest.fn().mockReturnValue({
  login: jest.fn().mockResolvedValue(authLoginStub()),
  logout: jest.fn().mockResolvedValue(authLogoutStub()),
});
