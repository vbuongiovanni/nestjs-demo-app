import { Injectable } from '@nestjs/common';
import { UserRequestDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: UserRequestDTO) {
    const newUser = new this.userModel(user);
    return newUser.save().then((user) => user.toObject());
  }

  findAll() {
    const users = this.userModel.find().lean();
    return users;
  }

  findOne(id: number) {
    const user = this.userModel.findOne({ _id: id }).lean();
    return user;
  }

  update(id: number, user: UserRequestDTO) {
    const updatedUser = this.userModel
      .find({ _id: id }, user, { new: true })
      .lean();
    return updatedUser;
  }

  remove(id: number) {
    const deletedUser = this.userModel.findOneAndDelete({ _id: id }).lean();
    return deletedUser;
  }
}
