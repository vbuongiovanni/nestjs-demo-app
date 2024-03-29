import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyRequestDto, CompanyResponseDto, CreateCompanyRequestDto } from './companies.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ActiveUser, ObjectIdParam, ReqAuthType } from 'src/common/decorators';
import { AuthType, IActiveUser } from 'src/common/types';
import { EmailService } from '../email/email.service';
import { InviteType } from 'src/mongodb';
import { ConfigService } from '@nestjs/config';
import { TemplateType } from '../email/types';

@Controller('companies')
@ReqAuthType(AuthType.Bearer)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('/register')
  @ReqAuthType(AuthType.Admin)
  async registerNewCompany(@Body() registerNewCompanyDto: CreateCompanyRequestDto) {
    const newCompany = await this.companiesService.registerNewCompany(registerNewCompanyDto);
    return plainToInstance(CompanyResponseDto, newCompany, { excludeExtraneousValues: true });
  }

  @Get()
  async findAllCompanies(@ActiveUser() activeUser: IActiveUser): Promise<CompanyResponseDto[]> {
    const { companyId } = activeUser;
    const allCompanies = await this.companiesService.findAllCompanies({ _id: { $in: [companyId] } });
    return plainToInstance(CompanyResponseDto, allCompanies, { excludeExtraneousValues: true });
  }

  @Get('/admin')
  @ReqAuthType(AuthType.Bearer)
  @ReqAuthType(AuthType.Admin)
  async findAllCompaniesAdmin(): Promise<CompanyResponseDto[]> {
    const allCompanies = await this.companiesService.findAllCompaniesAdmin();
    return plainToInstance(CompanyResponseDto, allCompanies, { excludeExtraneousValues: true });
  }

  @Get('/:_id')
  async findCompany(@ActiveUser() activeUser: IActiveUser, @ObjectIdParam('_id') _id: Types.ObjectId): Promise<CompanyResponseDto> {
    const { companyId } = activeUser;
    const company = await this.companiesService.findCompany({ $and: [{ _id }, { _id: { $in: [companyId] } }] });
    return plainToInstance(CompanyResponseDto, company, { excludeExtraneousValues: true });
  }

  @Patch('/:_id')
  async updateCompany(
    @ActiveUser() activeUser: IActiveUser,
    @ObjectIdParam('_id') _id: Types.ObjectId,
    @Body() updateCompanyDto: UpdateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    const { companyId } = activeUser;
    const updatedCompany = await this.companiesService.updateCompany(
      { $and: [{ _id }, { companies: { $in: [companyId] } }] },
      updateCompanyDto,
    );
    return plainToInstance(CompanyResponseDto, updatedCompany, { excludeExtraneousValues: true });
  }

  @Delete('/:_id')
  @ReqAuthType(AuthType.Admin)
  async removeCompany(@ActiveUser() activeUser: IActiveUser, @ObjectIdParam('_id') _id: Types.ObjectId): Promise<CompanyResponseDto> {
    const { companyId } = activeUser;
    const removedCompany = await this.companiesService.removeCompany({ $and: [{ _id }, { companies: { $in: [companyId] } }] });
    return plainToInstance(CompanyResponseDto, removedCompany, { excludeExtraneousValues: true });
  }
}
