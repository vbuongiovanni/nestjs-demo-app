import { Expose } from 'class-transformer';

export class RequestLogResponseDto {
  @Expose()
  clientIp: string;
  @Expose()
  userAgent: string;
  @Expose()
  url: string;
  @Expose()
  post: string;
  @Expose()
  method: string;
  @Expose()
  statusCode: string;
  @Expose()
  responseTime: number;
  @Expose()
  requestReceived: Date;
}
