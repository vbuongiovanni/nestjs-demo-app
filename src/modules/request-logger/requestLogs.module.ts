import { Module } from '@nestjs/common';
import { RequestLogsService } from './requestLogs.service';
import { RequestLogsController } from './requestLogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLogger, RequestLoggerSchema } from 'src/mongodb';
import { CustomLogger } from 'src/logger/custom-logger.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: RequestLogger.name, schema: RequestLoggerSchema }])],
  controllers: [RequestLogsController],
  providers: [RequestLogsService, CustomLogger],
})
export class RequestLogsModule {}
