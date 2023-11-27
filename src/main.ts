import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './logger/CustomLogger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useLogger(new CustomLogger());
  const port = configService.get('port');
  await app.listen(port);
}
bootstrap();
