import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyRequestDto, UpdateCompanyRequestDto, CompanyResponseDto, RegisterNewCompanyDto } from './companies.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ObjectIdParam, ReqAuthType } from 'src/common/decorators';
import { AuthType } from 'src/common/types';
import { UsersService } from '../users/users.service';

@Controller('companies')
@ReqAuthType(AuthType.Bearer)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createCompany(@Body() createCompanyDto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    const newCompany = await this.companiesService.createCompany(createCompanyDto);
    return plainToInstance(CompanyResponseDto, newCompany, { excludeExtraneousValues: true });
  }

  @Get()
  async findAllCompanies(): Promise<CompanyResponseDto[]> {
    const allCompanies = await this.companiesService.findAllCompanies();
    return plainToInstance(CompanyResponseDto, allCompanies, { excludeExtraneousValues: true });
  }

  @Get(':id')
  async findCompany(@ObjectIdParam('id') id: Types.ObjectId): Promise<CompanyResponseDto> {
    const company = await this.companiesService.findCompany(id);
    return plainToInstance(CompanyResponseDto, company, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  async updateCompany(
    @ObjectIdParam('id') id: Types.ObjectId,
    @Body() updateCompanyDto: UpdateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    const updatedCompany = await this.companiesService.updateCompany(id, updateCompanyDto);
    return plainToInstance(CompanyResponseDto, updatedCompany, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  async removeCompany(@ObjectIdParam('id') id: Types.ObjectId): Promise<CompanyResponseDto> {
    const removedCompany = await this.companiesService.removeCompany(id);
    return plainToInstance(CompanyResponseDto, removedCompany, { excludeExtraneousValues: true });
  }

  @Post('/register-company')
  async registerNewCompany(@Body() registerNewCompanyDto: RegisterNewCompanyDto) {
    const { companyName, firstName, lastName, email } = registerNewCompanyDto;
    const newCompany = await this.companiesService.createCompany({ name: companyName });
    return plainToInstance(CompanyResponseDto, newCompany, { excludeExtraneousValues: true });
  }
}
