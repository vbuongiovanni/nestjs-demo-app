import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDTO, UpdateUserRequestDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../mongodb';
import { CustomLogger } from '../../logger/custom-logger.service';
import { DuplicateRecordException } from 'src/common/exceptions';
import { Types } from 'mongoose';
import { IUser } from 'src/common/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('UserService');
  }

  async createUser(user: CreateUserRequestDTO) {
    try {
      const foundUser = await this.userModel.findOne({ email: user.email });
      if (foundUser) {
        throw new DuplicateRecordException();
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

  async findUser(_id: Types.ObjectId) {
    try {
      const [user] = await this.userModel.aggregate([
        { $match: { _id } },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
            pipeline: [{ $project: { name: 1, permissions: 1, _id: 1 } }],
          },
        },
        { $unwind: '$role' },
      ]);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user as IUser;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.findOne(${_id}): ${ex.message}`, ex);
      return null;
    }
  }

  updateUser(_id: Types.ObjectId, user: Partial<UpdateUserRequestDTO>) {
    try {
      const updatedUser = this.userModel.findOneAndUpdate({ _id }, user, { new: true }).lean();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.update(${_id}, ${JSON.stringify(user)}): ${ex.message}`, ex);
      return null;
    }
  }

  removeUser(_id: Types.ObjectId) {
    try {
      const deletedUser = this.userModel.findOneAndDelete({ _id }).lean();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.findOneAndDelete(${_id}): ${ex.message}`, ex);
      return null;
    }
  }
}
