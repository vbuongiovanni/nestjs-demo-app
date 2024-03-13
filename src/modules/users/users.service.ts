import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountUserDto, CreateUserRequestDTO, InviteUserRequestDTO, RespondToInviteDTO, UpdateUserRequestDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument, Invite, InviteDocument, InviteType, Role, RoleDocument, User, UserDocument } from '../../mongodb';
import { CustomLogger } from '../../logger/custom-logger.service';
import { DuplicateRecordException } from 'src/common/exceptions';
import { Types } from 'mongoose';
import { UserCompanies, UserCompaniesDocument } from 'src/mongodb/schemas/user-companies';
import { InvitesService } from '../invites/invites.service';
import { ConfigService } from '@nestjs/config';
import { TMailData, TemplateType } from '../email/types';
import { EmailService } from '../email/email.service';
import { randomUUID } from 'crypto';

type TQuery = { $and: [{ _id: Types.ObjectId }, { companies: { $in: Types.ObjectId[] } }] } | { companies: { $in: Types.ObjectId[] } };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Invite.name) private readonly inviteModel: Model<InviteDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(UserCompanies.name) private readonly userCompanyModel: Model<UserCompaniesDocument>,
    private readonly configService: ConfigService,
    private readonly invitesService: InvitesService,
    private readonly emailService: EmailService,
    private readonly customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('UserService');
  }

  async inviteUser(user: InviteUserRequestDTO, activeUserId: Types.ObjectId, companyIds: Types.ObjectId[]) {
    console.log(user);
    try {
      const url = this.configService.get<string>('FRONTEND_URL');
      const { firstName, lastName, email, companyId, roleId } = user;
      const company = await this.companyModel.findOne({ _id: companyId }).lean();
      if (!companyIds.map((id) => id.toString()).includes(companyId.toString()) || !company) {
        throw new ForbiddenException('Not allowed to invite user for this company');
      }
      const foundUser = await this.userModel.findOne({ email }).lean();
      const userId = foundUser?._id;

      const createInviteDto = {
        userId,
        companyId,
        roleId,
        firstName,
        lastName,
        email,
        type: InviteType.userToUser,
      };

      const invite = await this.invitesService.createInvite(createInviteDto);

      const link = `${url}/${userId ? 'invite' : 'register'}/${companyId}/${invite.link}`;

      const emailData: TMailData = {
        email,
        content: {
          type: TemplateType.existingCompanyUser,
          context: {
            link,
            userName: `${firstName} ${lastName}`,
            companyName: company?.name,
          },
        },
      };

      await this.emailService.sendMail(emailData);
      return 'it worked';
    } catch (ex) {
      console.error(ex);
    }
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

  async findActiveUser(query: TQuery) {
    try {
      const user = await this.userModel.findOne(query).lean();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userCompanyRoles = await this.userCompanyModel.aggregate([
        { $match: { userId: user._id } },
        {
          $lookup: {
            from: 'roles',
            localField: 'roleId',
            foreignField: '_id',
            as: 'role',
          },
        },
        { $unwind: '$role' },
      ]);

      return { user, userCompanyRoles };
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

  async respondToInvite(_id: Types.ObjectId, userId: Types.ObjectId, respondToInvite: RespondToInviteDTO) {
    const { linkId, action } = respondToInvite;
    try {
      const invite = await this.inviteModel.findOne({ _id, userId, link: linkId, status: 'pending' }).lean();
      if (!invite) throw new NotFoundException('Invite not found');
      const companyId = invite.companyId;
      if (action === 'reject') {
        await this.inviteModel
          .findOneAndUpdate(
            { _id, userId, link: linkId, status: 'pending' },
            { status: 'rejected', dateUpdated: new Date() },
            { new: true },
          )
          .lean();
        return null;
      } else if (action === 'accept') {
        const adminRole = await this.roleModel.findOne({ name: 'Admin' });
        const adminRoleId = adminRole._id;
        await this.userCompanyModel.create({ companyId, userId, roleId: adminRoleId, isAccountOwner: true });
        const updatedUser = await this.userModel
          .findOneAndUpdate(
            { _id: userId },
            { $push: { companies: companyId }, roleId: adminRoleId, isCompanyAdmin: true, isRegistered: true },
            { new: true },
          )
          .lean();
        if (updatedUser) {
          await this.inviteModel.findOneAndUpdate(
            { _id, companyId, userId, link: linkId, status: 'pending' },
            { status: 'accepted', dateUpdated: new Date() },
          );
          return updatedUser;
        } else {
          throw new BadRequestException('User not found');
        }
      } else {
        throw new BadRequestException(`Invalid action (${action})`);
      }
    } catch (ex) {
      this.customLogger.logger(`Error in users.service inviteModel.findOne: ${ex.message}`, ex);
      throw ex;
    }
  }

  async createCompanyUser(_id: Types.ObjectId, newUserBody: CreateAccountUserDto) {
    try {
      const { firstName, lastName, email, phone, password, linkId, companyId, roleId } = newUserBody;
      const verifiedInvite = await this.inviteModel.findOne({ _id, companyId, link: linkId }).lean();
      if (verifiedInvite) {
        const newUser = new this.userModel({
          companies: [companyId],
          firstName,
          lastName,
          email,
          phone,
          password,
        });

        const isAccountOwner = verifiedInvite.type === 'welcomeAboard' ? true : false;

        return newUser.save().then(async (user) => {
          const userId = user._id;
          await this.userCompanyModel.create({ companyId, userId, roleId, isAccountOwner });
          await this.inviteModel.findOneAndUpdate({ _id }, { status: 'accepted', dateUpdated: new Date(), userId });
          if (isAccountOwner) await this.companyModel.findOneAndUpdate({ _id: companyId }, { accountOwner: newUser._id });
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
}
