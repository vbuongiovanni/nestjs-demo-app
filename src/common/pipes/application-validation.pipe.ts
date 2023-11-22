import { ValidationPipe } from '@nestjs/common';

export const ApplicationValidationPipe = new ValidationPipe({
  whitelist: true, // This will remove any properties that are not in the DTO
  transform: true, // This will transform the incoming data to the DTO type
  forbidNonWhitelisted: true, // This will throw an error if there are properties that are not in the DTO
  transformOptions: {
    enableImplicitConversion: true,
  },
});
