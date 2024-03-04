import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountOwnerRequestDTO, CreateUserRequestDTO, UpdateUserRequestDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument, Invite, InviteDocument, Role, RoleDocument, User, UserDocument } from '../../mongodb';
import { CustomLogger } from '../../logger/custom-logger.service';
import { DuplicateRecordException } from 'src/common/exceptions';
import { Types } from 'mongoose';

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

        const newUserDocument = newUser.save().then(async (user) => {
          await this.inviteModel.findOneAndUpdate({ _id: inviteId }, { status: 'accepted', dateUpdated: new Date() });
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
      const user = await this.userModel.findOne({ _id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
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
