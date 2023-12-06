import { Injectable } from '@nestjs/common';
import { CreateCatRequestDto, UpdateCatRequestDto } from './cats.dto';

@Injectable()
export class CatsService {
  createCat(updateUserBody: CreateCatRequestDto) {
    return 'This action adds a new cat';
  }
  getCats() {
    return ['this returns all cats'];
  }
  getCat(id: string) {
    return 'this returns a cat';
  }
  updateCat(id: string, updateUserBody: Partial<UpdateCatRequestDto>) {
    return 'This updates a cat';
  }
  deleteCat(id: string) {
    return 'This deletes a cat';
  }
}
