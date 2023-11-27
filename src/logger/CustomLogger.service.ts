import { ConsoleLogger, Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

const consoleTransport = new transports.Console({
  level: 'LOG_LEVEL',
  format: format.json(),
  silent: false,
});

export const logger = createLogger({
  transports: [consoleTransport],
});

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  logger(message: string, ex: Error | null = null) {
    logger.error(message, ex);
  }
}
