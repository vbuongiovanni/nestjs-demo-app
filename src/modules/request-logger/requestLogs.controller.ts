import { Controller, Get } from '@nestjs/common';
import { RequestLogsService } from './requestLogs.service';
import { AuthType } from 'src/common/types';
import { ReqAuthType } from 'src/common/decorators';
import { RequestLogResponseDto } from './requestLogs.dto';
import { plainToInstance } from 'class-transformer';

@Controller('request-logs')
@ReqAuthType(AuthType.Bearer)
export class RequestLogsController {
  constructor(private readonly requestLogsService: RequestLogsService) {}

  @Get()
  async findAllLogs(): Promise<RequestLogResponseDto[]> {
    const logs = await this.requestLogsService.findAllLogs();
    return plainToInstance(RequestLogResponseDto, logs, { excludeExtraneousValues: true });
  }
}
