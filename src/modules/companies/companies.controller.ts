import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyRequestDto, UpdateCompanyRequestDto, CompanyResponseDto } from './companies.dto';
import { plainToInstance } from 'class-transformer';
import { ToObjectIdPipe } from 'src/common/pipes';
import { Types } from 'mongoose';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

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
  async findCompany(@Param('id', ToObjectIdPipe) id: Types.ObjectId): Promise<CompanyResponseDto> {
    const company = await this.companiesService.findCompany(id);
    return plainToInstance(CompanyResponseDto, company, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  async updateCompany(
    @Param('id', ToObjectIdPipe) id: Types.ObjectId,
    @Body() updateCompanyDto: UpdateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    const updatedCompany = await this.companiesService.updateCompany(id, updateCompanyDto);
    return plainToInstance(CompanyResponseDto, updatedCompany, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  async removeCompany(@Param('id', ToObjectIdPipe) id: Types.ObjectId): Promise<CompanyResponseDto> {
    const removedCompany = await this.companiesService.removeCompany(id);
    return plainToInstance(CompanyResponseDto, removedCompany, { excludeExtraneousValues: true });
  }
}
