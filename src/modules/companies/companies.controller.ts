import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyRequestDto, CompanyResponseDto, CreateCompanyRequestDto } from './companies.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ObjectIdParam, ReqAuthType } from 'src/common/decorators';
import { AuthType } from 'src/common/types';
import { EmailService } from '../email/email.service';
import { InviteType } from 'src/mongodb';
import { ConfigService } from '@nestjs/config';
import { TemplateType } from '../email/types';

@Controller('companies')
@ReqAuthType(AuthType.Bearer)
export class CompaniesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly companiesService: CompaniesService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/register')
  async registerNewCompany(@Body() registerNewCompanyDto: CreateCompanyRequestDto) {
    const url = this.configService.get<string>('FRONTEND_URL');
    const { companyName, firstName, lastName, email } = registerNewCompanyDto;
    const newCompany = await this.companiesService.createCompany(companyName);
    const companyId = newCompany._id;
    const createInviteDto = {
      companyId: companyId,
      type: InviteType.welcomeAboard,
    };
    const invite = await this.companiesService.createWelcomeAboardInvite(createInviteDto);

    const emailData = {
      email,
      firstName,
      lastName,
      companyName,
      content: {
        type: TemplateType.welcomeAboard,
        context: {
          link: `${url}/${companyId}/${invite.link}`,
          name: `${firstName} ${lastName}`,
        },
      },
    };

    await this.emailService.sendMail(emailData);

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
}
