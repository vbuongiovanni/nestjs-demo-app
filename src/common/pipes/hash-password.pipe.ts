import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateAccountOwnerRequestDTO, CreateUserRequestDTO, UpdateUserRequestDTO } from '../../modules/users/user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const performHash = async (body: { password: string }, saltRounds = 10) => {
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);
  return { ...body, password: hashedPassword };
};

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}
  async transform(value: CreateUserRequestDTO | CreateAccountOwnerRequestDTO, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const saltRounds = this.configService.get<number>('saltRounds');
      return await performHash(value, saltRounds);
    } else {
      return value;
    }
  }
}
