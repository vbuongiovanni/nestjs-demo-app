import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountOwnerRequestDTO, CreateUserRequestDTO, UpdateUserRequestDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument, Invite, InviteDocument, Role, RoleDocument, User, UserDocument } from '../../mongodb';
import { CustomLogger } from '../../logger/custom-logger.service';
import { DuplicateRecordException } from 'src/common/exceptions';
import { Types } from 'mongoose';

type TQuery =
  | { companyId: Types.ObjectId; _id?: Types.ObjectId }
  | { $and: [{ _id: Types.ObjectId }, { companyId: { $in: Types.ObjectId[] } }] }
  | { companyId: { $in: Types.ObjectId[] } };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Invite.name) private readonly inviteModel: Model<InviteDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('UserService');
  }

  async createUser(user: CreateUserRequestDTO) {
    try {
      const newUser = new this.userModel(user);
      return newUser.save().then((user) => user.toObject());
    } catch (ex) {
      if (ex.message === 'User already exists') {
        throw new DuplicateRecordException();
      }
      this.customLogger.logger(`Error in users.service userModel.find(): ${ex.message}`, ex);
      return null;
    }
  }

  async createAccountOwner(inviteId: Types.ObjectId, newUserBody: CreateAccountOwnerRequestDTO) {
    try {
      const { firstName, lastName, email, phone, password, linkId } = newUserBody;
      const companyId = new Types.ObjectId(newUserBody.companyId);
      const verifiedInvite = await this.inviteModel.findOne({ _id: inviteId, companyId, link: linkId });
      if (verifiedInvite) {
        const role = await this.roleModel.findOne({ name: 'Admin' });
        const roleId = role._id;
        const newUser = new this.userModel({
          companyId,
          firstName,
          lastName,
          email,
          phone,
          password,
          isCompanyAdmin: true,
          isRegistered: true,
          roleId,
        });

        return newUser.save().then(async (user) => {
          await this.inviteModel.findOneAndUpdate({ _id: inviteId }, { status: 'accepted', dateUpdated: new Date(), userId: user._id });
          await this.companyModel.findOneAndUpdate({ _id: companyId }, { accountOwner: newUser._id });
          return user.toObject();
        });
      } else {
        throw new BadRequestException('Invalid invite');
      }
    } catch (ex) {
      if (ex.message === 'User already exists') {
        throw new DuplicateRecordException();
      }
      this.customLogger.logger(`Error in users.service userModel.find(): ${ex.message}`, ex);
      return null;
    }
  }

  findAllUsers(query: TQuery) {
    try {
      const users = this.userModel.find(query).lean();
      return users;
    } catch (ex) {
      this.customLogger.logger(`Error in users.service userModel.find: ${ex.message}`, ex);
      return [];
    }
  }

  findAllUsersAdmin() {
    try {
      const users = this.userModel.find().lean();
      return users;
    } catch (ex) {
      this.customLogger.logger(`Error in users.service userModel.find: ${ex.message}`, ex);
      return [];
    }
  }

  async findUser(query: TQuery) {
    try {
      const user = await this.userModel.findOne(query);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.findOne: ${ex.message}`, ex);
      return null;
    }
  }

  updateUser(query: TQuery, user: Partial<UpdateUserRequestDTO>) {
    try {
      const updatedUser = this.userModel.findOneAndUpdate(query, user, { new: true }).lean();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.update: ${ex.message}`, ex);
      return null;
    }
  }

  removeUser(query: TQuery) {
    try {
      const deletedUser = this.userModel.findOneAndDelete(query).lean();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (ex) {
      if (ex.message === 'User not found') {
        throw ex;
      }
      this.customLogger.logger(`Error in users.service userModel.findOneAndDelete: ${ex.message}`, ex);
      return null;
    }
  }
}
