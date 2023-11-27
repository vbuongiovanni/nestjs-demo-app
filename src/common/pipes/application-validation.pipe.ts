import { ValidationPipe } from '@nestjs/common';

export const ApplicationValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  // This will throw an error if there are properties that are not in the DTO
  // By commenting this option out, any properties not defined in DTO will be striped out
  // forbidNonWhitelisted: true,
  // This will implicitly convert the type of the properties in the DTO based on Type.
  // By commenting it out, we will have to manually convert the type of the properties in the DTO
  transformOptions: {
    enableImplicitConversion: true,
  },
});
