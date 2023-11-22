import { Controller, Get, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloDto } from './common/dtos/hello.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Body() body: HelloDto): string {
    const { name } = body;
    return this.appService.getHello(name);
  }
}
