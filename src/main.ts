import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports } from 'winston';
import { CustomLogger } from './logger/CustomLogger.service';

// Winston logger to catch all errors tied to mongodb calls.
const consoleTransport = new transports.Console({
  level: 'LOG_LEVEL',
  format: format.json(),
  silent: false,
});

export const logger = createLogger({
  transports: [consoleTransport],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useLogger(new CustomLogger());
  const port = configService.get('port');
  await app.listen(port);
}
bootstrap();
