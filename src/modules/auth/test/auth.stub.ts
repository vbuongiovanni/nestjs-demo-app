import { Auth, User } from '../../../mongodb';
import { AuthRequestDTO, AuthResponseDTO, AuthLogoutRequestDTO } from '../auth.dto';

export const userLoginBody: AuthRequestDTO = {
  email: 'test@email.com',
  password: 'aLegitPassword',
};

export const userLogoutBody: AuthLogoutRequestDTO = {
  userId: '655c0a1922b10d6dca4da6c6',
};

export const authLoginStub = (): AuthResponseDTO => ({
  _id: '655c0a1922b10d6dca4da6c7',
  userId: '655c0a1922b10d6dca4da6c6',
  token: '45ed7e2e-5ca2-4b01-9516-c1d175535878',
  expiration: new Date('2023-11-22T06:17:45.121+0000'),
});

export const authLogoutStub = (): Record<string, never> => ({});

export const authDocument = (): User => ({
  name: 'Test User',
  email: 'test@email.com',
  password: '$2b$10$XhZFnXGAbVJwV6.OQmb47./UDwdQRVw08iE7TwAmzY/M3yUAr6Hre',
});
