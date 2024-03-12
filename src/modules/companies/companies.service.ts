import { Injectable } from '@nestjs/common';
import { CreateCompanyRequestDto, UpdateCompanyRequestDto } from './companies.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from 'src/mongodb/schemas/company.schema';
import { Model, Types } from 'mongoose';
import { CustomLogger } from 'src/logger/custom-logger.service';
import { InvitesService } from '../invites/invites.service';
import { CreateWelcomeAboardInviteRequestDto } from '../invites/invites.dto';
import { TQuery } from 'src/common/types/query';
import { ConfigService } from '@nestjs/config';
import { InviteType, User, UserDocument } from 'src/mongodb';
import { TMailData, TemplateType } from '../email/types';
import { EmailService } from '../email/email.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly invitesService: InvitesService,
    private readonly emailService: EmailService,
    private readonly customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('CompanyService');
  }

  async createCompany(name: string, accountOwner?: Types.ObjectId) {
    try {
      const newCompany = new this.companyModel({ name, accountOwner });
      return await newCompany.save().then((company) => company.toObject());
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.createCompany(): ${ex.message}`, ex);
      return null;
    }
  }

  async findAllCompanies(query: TQuery) {
    try {
      const allCompanies = await this.companyModel.find(query).lean();
      return allCompanies;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.findAllCompanies(): ${ex.message}`, ex);
      return null;
    }
  }

  async findAllCompaniesAdmin() {
    try {
      const allCompanies = await this.companyModel.find().lean();
      return allCompanies;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.findAllCompanies(): ${ex.message}`, ex);
      return null;
    }
  }

  async findCompany(query: TQuery) {
    try {
      const company = await this.companyModel.findOne(query).lean();
      return company;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.findCompany(): ${ex.message}`, ex);
      return null;
    }
  }

  async updateCompany(query: TQuery, updateCompanyBody: UpdateCompanyRequestDto) {
    try {
      const updateCompany = await this.companyModel.findOneAndUpdate(query, updateCompanyBody, { new: true }).lean();
      return updateCompany;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.updateCompany(): ${ex.message}`, ex);
      return null;
    }
  }

  async removeCompany(query: TQuery) {
    try {
      await this.companyModel.findOneAndDelete(query).lean();
      return 'Success';
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.removeCompany(): ${ex.message}`, ex);
      return null;
    }
  }

  async registerNewCompany(registerNewCompanyDto: CreateCompanyRequestDto) {
    const url = this.configService.get<string>('FRONTEND_URL');
    const { companyName, firstName, lastName, email } = registerNewCompanyDto;
    try {
      const user = await this.userModel.findOne({ email: email }).lean();
      const userId = user?._id;
      const newCompany = await this.createCompany(companyName, userId);
      const companyId = newCompany._id;
      const createInviteDto = {
        companyId,
        userId,
        firstName,
        lastName,
        email,
        type: InviteType.welcomeAboard,
      };
      const invite = await this.invitesService.createInvite(createInviteDto);
      const link = `${url}/${userId ? 'invite' : 'register'}/${companyId}/${invite.link}`;
      const emailData: TMailData = {
        email,
        content: {
          type: userId ? TemplateType.newCompanyExistingUser : TemplateType.newCompanyNewUser,
          context: {
            link,
            userName: `${firstName} ${lastName}`,
            companyName,
          },
        },
      };
      await this.emailService.sendMail(emailData);
      return newCompany;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.createWelcomeAboardInvite(): ${ex.message}`, ex);
      return null;
    }
  }
}
