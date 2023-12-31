import { UserDocument } from '../../../mongodb';
import { CreateUserRequestDTO, UpdateUserRequestDTO, UserResponseDTO } from '../user.dto';
import { Types } from 'mongoose';

export const createUserRequestBody: CreateUserRequestDTO = {
  name: 'Test User',
  email: 'someEmail@gmail.com',
  password: 'somePassword',
};

export const updateUserRequestBody: Partial<UpdateUserRequestDTO> = {
  name: 'Updated Test User Name',
};

export const user1Id = '655c0a1922b10d6dca4da6c6';

export const userDocument = { ...createUserRequestBody, _id: new Types.ObjectId(user1Id) } as UserDocument;

const user1: UserResponseDTO = {
  ...createUserRequestBody,
  _id: user1Id,
};

const user2: UserResponseDTO = {
  _id: '655c0a1922b10d6dca4da6c7',
  name: 'Different Test User',
  email: 'someDifferentEmail@gmail.com',
};

export const createUserStub = (): UserResponseDTO => user1;

export const findAllUsersStub = (): UserResponseDTO[] => [user1, user2];

export const findUserStub = (): UserResponseDTO => user1;

export const updateUserStub = (): UserResponseDTO => ({ ...user1, ...updateUserRequestBody });

export const removeUserStub = (): UserResponseDTO => user1;
