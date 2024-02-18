import { Injectable } from '@nestjs/common';
import { CreateCompanyRequestDto, UpdateCompanyRequestDto } from './companies.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from 'src/mongodb/schemas/company.schema';
import { Model, Types } from 'mongoose';
import { CustomLogger } from 'src/logger/custom-logger.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('CompanyService');
  }

  async createCompany(createCompanyBody: CreateCompanyRequestDto) {
    try {
      const newCompany = new this.companyModel(createCompanyBody);
      return await newCompany.save().then((user) => user.toObject());
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.createCompany(): ${ex.message}`, ex);
      return null;
    }
  }

  async findAllCompanies() {
    try {
      const allRoles = await this.companyModel.find().lean();
      return allRoles;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.findAllCompanies(): ${ex.message}`, ex);
      return null;
    }
  }

  async findCompany(_id: Types.ObjectId) {
    try {
      const newRole = await this.companyModel.findOne({ _id }).lean();
      return newRole;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.findCompany(): ${ex.message}`, ex);
      return null;
    }
  }

  async updateCompany(_id: Types.ObjectId, updateCompanyBody: UpdateCompanyRequestDto) {
    try {
      const updatedRole = await this.companyModel.findOneAndUpdate({ _id }, updateCompanyBody, { new: true }).lean();
      return updatedRole;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.updateCompany(): ${ex.message}`, ex);
      return null;
    }
  }

  async removeCompany(_id: Types.ObjectId) {
    try {
      const newRole = await this.companyModel.findOneAndDelete({ _id }).lean();
      return newRole;
    } catch (ex) {
      this.customLogger.logger(`Error in companies.service.removeCompany(): ${ex.message}`, ex);
      return null;
    }
  }
}
