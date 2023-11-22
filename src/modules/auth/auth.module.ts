import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  // User, UserSchema,
  Auth,
  AuthSchema,
} from '../../mongodb';

@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
