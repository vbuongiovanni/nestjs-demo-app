import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestLogger, RequestLoggerDocument } from '../../mongodb';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(RequestLogger.name)
    private readonly requestLoggerModel: Model<RequestLoggerDocument>,
  ) {}
  use(req: Request, res: Response, next: () => void) {
    const requestTime = new Date();

    res.on('finish', () => {
      const statusCode = res.statusCode;

      const clientIp = req.ip || req.headers['x-client-ip'] || req.connection.remoteAddress;
      const authorization = req.headers['authorization'];

      // only retains authorization and body for 400 or higher status codes:
      const logEntry = {
        clientIp,
        userAgent: req.headers['user-agent'],
        url: req.originalUrl,
        method: req.method,
        statusCode,
        requestReceived: requestTime.toISOString(),
        responseTime: new Date().getTime() - requestTime.getTime(),
        authorization: statusCode >= 400 ? authorization : undefined,
        body: statusCode >= 400 ? JSON.stringify(req.body) : undefined,
      };
      const newRequestLog = new this.requestLoggerModel(logEntry);
      newRequestLog.save();
    });

    next();
  }
}
