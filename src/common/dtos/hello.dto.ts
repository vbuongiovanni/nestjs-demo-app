import { IsOptional } from 'class-validator';

export class HelloDto {
  @IsOptional()
  name: string;
}
