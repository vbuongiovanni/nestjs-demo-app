import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UpdateCatRequestDto, CreateCatRequestDto } from './cats.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
  @Post('')
  createCat(@Body() createCatBody: CreateCatRequestDto) {
    return this.catsService.createCat(createCatBody);
  }
  @Get('')
  getCats() {
    return this.catsService.getCats();
  }
  @Get(':id')
  getCat(@Param('id') id: string) {
    return this.catsService.getCat(id);
  }
  @Put(':id')
  updateCat(@Param('id') id: string, @Body() updateCatBody: Partial<UpdateCatRequestDto>) {
    return this.catsService.updateCat(id, updateCatBody);
  }
  @Delete(':id')
  deleteCat(@Param('id') id: string) {
    return this.catsService.deleteCat(id);
  }
}
