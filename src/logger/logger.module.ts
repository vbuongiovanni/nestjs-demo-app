import { Module } from '@nestjs/common';
import { CustomLogger } from './CustomLogger.service';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
