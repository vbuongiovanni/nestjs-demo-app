import { ConsoleLogger, Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

const consoleTransport = new transports.Console({
  level: 'LOG_LEVEL',
  format: format.json(),
  silent: false,
});

const logger = createLogger({
  transports: [consoleTransport],
});

@Injectable()
export class CustomLogger extends ConsoleLogger {
  logger(message: string, ex: Error | null = null) {
    logger.error(message, ex);
  }
  log(message: string) {
    logger.info(message);
  }
  error(message: string) {
    logger.error(message, 'ex');
  }
}
