import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDTO, UpdateUserRequestDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../mongodb';
import { CustomLogger } from '../../logger/custom-logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('AuthService');
  }

  async createUser(user: CreateUserRequestDTO) {
    try {
      const foundUser = await this.userModel.findOne({ email: user.email });
      if (foundUser) {
        throw new BadRequestException('User already exists');
      }
      const newUser = new this.userModel(user);
      return newUser.save().then((user) => user.toObject());
    } catch (ex) {
      if (ex.message === 'User already exists') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.find(): ${ex.message}`, ex);
      return null;
    }
  }

  findAllUsers() {
    try {
      const users = this.userModel.find().lean();
      return users;
    } catch (ex) {
      this.customLogger.logger(`Error in users.service userModel.find(): ${ex.message}`, ex);
      return [];
    }
  }

  findUser(id: string) {
    try {
      const user = this.userModel.findOne({ _id: id }).lean();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.findOne(${id}): ${ex.message}`, ex);
      return null;
    }
  }

  updateUser(id: string, user: Partial<UpdateUserRequestDTO>) {
    try {
      const updatedUser = this.userModel.findOneAndUpdate({ _id: id }, user, { new: true }).lean();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.update(${id}, ${JSON.stringify(user)}): ${ex.message}`, ex);
      return null;
    }
  }

  removeUser(id: string) {
    try {
      const deletedUser = this.userModel.findOneAndDelete({ _id: id }).lean();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.findOneAndDelete(${id}): ${ex.message}`, ex);
      return null;
    }
  }
}
