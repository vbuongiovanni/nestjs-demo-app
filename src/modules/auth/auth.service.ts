import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  // User, UserDocument,
  Auth, AuthDocument } from '../../mongodb/schemas';
import { AuthLogoutRequestDTO, AuthRequestDTO } from './auth.dto';
// import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
// import { logger } from '../../main';

@Injectable()
export class AuthService {
  constructor(
    // @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) {}

  async login(body: AuthRequestDTO) {
    const { email, password } = body;
    // const user = await this.userModel.findOne({ email })
    // .catch((ex) => {
    //   logger.error(`Error in auth.service userModel.findOne(${email}): ${ex.message}`, ex);
    //   return null;
    // });

    // const isMatch = await bcrypt.compare(password, user?.password || '');

    // if (!user || !isMatch) {
    //   throw new UnauthorizedException('Invalid user or incorrect credentials.');
    // }

    // await this.authModel.findOneAndDelete({ userId: user._id })
    // .catch((ex) => {
    //   logger.error(`Error in auth.service authModel.findOneAndDelete(${email}): ${ex.message}`, ex);
    //   return null;
    // });

    const token = uuid();
    const newAuth = new this.authModel({ userId: "user._id", token });
    const savedAuth = await newAuth.save()
    // .catch((ex) => {
    //   logger.error(`Error in auth.service authModel.save(${newAuth}): ${ex.message}`, ex);
    //   return null;
    // });

    return savedAuth.toObject();
  }

  async logout(body: AuthLogoutRequestDTO) {
    const { userId } = body;
    const deletedAuth = await this.authModel.findOneAndDelete({ userId })
    // .catch((ex) => {
    //   logger.error(`Error in auth.service authModel.save(${userId}): ${ex.message}`, ex);
    //   return null;
    // });
    if (deletedAuth) {
      return {};
    } else {
      throw new BadRequestException('Invalid user.');
    }
  }
}
