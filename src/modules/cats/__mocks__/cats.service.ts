import { jest } from '@jest/globals';
import { createCatStub, getCatStub, getCatsStub, updateCatStub, deleteCatStub } from '../tests/cats.stub';

// this file was generated by nestjs/schematics - controller-spec

export const CatsService = jest.fn().mockReturnValue({
  createCat: jest.fn().mockReturnValue(createCatStub()),
  getCat: jest.fn().mockReturnValue(getCatStub()),
  getCats: jest.fn().mockReturnValue(getCatsStub()),
  updateCat: jest.fn().mockReturnValue(updateCatStub()),
  deleteCat: jest.fn().mockReturnValue(deleteCatStub()),
});
