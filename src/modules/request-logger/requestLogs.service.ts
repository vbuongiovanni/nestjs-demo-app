import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestLogger, RequestLoggerDocument } from '../../mongodb';
import { Model } from 'mongoose';
import { CustomLogger } from '../../logger/custom-logger.service';

@Injectable()
export class RequestLogsService {
  constructor(
    private customLogger: CustomLogger,
    @InjectModel(RequestLogger.name) private readonly requestLogger: Model<RequestLoggerDocument>,
  ) {
    this.customLogger.setContext('RequestLogs');
  }
  async findAllLogs() {
    try {
      return this.requestLogger.aggregate([{ $limit: 10 }]);
    } catch (ex) {
      this.customLogger.logger(`Error in users.service userModel.find(): ${ex.message}`, ex);
      return [];
    }
  }
}
