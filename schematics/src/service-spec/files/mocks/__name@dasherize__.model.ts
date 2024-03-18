import { jest } from '@jest/globals';
import { test<%= classify(singularName) %>1, test<%= classify(singularName) %>2, updatedTest<%= classify(singularName) %>1 } from '../tests/<%= dasherize(name) %>.stub';

export const create<%= classify(singularName) %>Stub = () => null;
export const find<%= classify(name) %>Stub = () => [test<%= classify(singularName) %>1, test<%= classify(singularName) %>2];
export const findOne<%= classify(singularName) %>Stub = () => test<%= classify(singularName) %>1;
export const findOneAndUpdate<%= classify(singularName) %>Stub = () => updatedTest<%= classify(singularName) %>1;
export const update<%= classify(singularName) %>Stub = () => null;
export const deleteOne<%= classify(singularName) %>Stub = () => null;

export const Mock<%= classify(name) %>Model = jest.fn().mockReturnValue({
  create: jest.fn().mockImplementation(() => ({
    then: () => create<%= classify(singularName) %>Stub()
  })),
  find: jest.fn().mockImplementation(() => ({
    lean: () => find<%= classify(name) %>Stub(),
  })),
  findOne: jest.fn().mockImplementation(() => ({
    lean: () => findOne<%= classify(singularName) %>Stub(),
  })),
  findOneAndUpdate: jest.fn().mockImplementation(() => ({
    then: () => findOneAndUpdate<%= classify(singularName) %>Stub(),
  })),
  update: jest.fn().mockReturnValue(update<%= classify(singularName) %>Stub()),
  deleteOne: jest.fn().mockReturnValue(deleteOne<%= classify(singularName) %>Stub()),
});
