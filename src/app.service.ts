import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(name?: string): string {
    if (name) {
      return `Hello ${name}!`;
    } else {
      return 'Hello World!';
    }
  }
}
