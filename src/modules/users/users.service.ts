import { Injectable } from '@nestjs/common';
import { CreateUserRequestDTO, UpdateUserRequestDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../mongodb';
import { logger } from '../../main';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async createUser(user: CreateUserRequestDTO) {
    const newUser = new this.userModel(user);
    return newUser.save().then((user) => user.toObject());
  }

  findAllUsers() {
    const users = this.userModel
      .find()
      .lean()
      .catch((ex) => {
        logger.error(`Error in users.service userModel.find(): ${ex.message}`, ex);
        return [];
      });
    return users;
  }

  findUser(id: number) {
    const user = this.userModel
      .findOne({ _id: id })
      .lean()
      .catch((ex) => {
        logger.error(`Error in users.service userModel.findOne(${id}): ${ex.message}`, ex);
        return null;
      });
    return user;
  }

  updateUser(id: number, user: UpdateUserRequestDTO) {
    const updatedUser = this.userModel
      .find({ _id: id }, user, { new: true })
      .lean()
      .catch((ex) => {
        logger.error(`Error in users.service userModel.update(${id}, ${JSON.stringify(user)}): ${ex.message}`, ex);
        return null;
      });
    return updatedUser;
  }

  removeUser(id: number) {
    const deletedUser = this.userModel
      .findOneAndDelete({ _id: id })
      .lean()
      .catch((ex) => {
        logger.error(`Error in users.service userModel.findOneAndDelete(${id}): ${ex.message}`, ex);
        return null;
      });
    return deletedUser;
  }
}
