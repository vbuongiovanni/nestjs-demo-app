import { ValidationPipe } from '@nestjs/common';

export const ApplicationValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  // This will implicitly convert the type of the properties in the DTO based on Type.
  // By commenting it out, we will have to manually convert the type of the properties in the DTO
  // transformOptions: {
  //   enableImplicitConversion: false,
  // },
});
