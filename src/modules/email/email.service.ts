import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TMailData, TemplateType } from './types';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  private getSubject(type: TemplateType, userName: string, companyName: string) {
    switch (type) {
      case TemplateType.newCompanyNewUser:
        return `Welcome aboard, ${userName}!`;
      case TemplateType.newCompanyExistingUser:
        return `You're the account owner of ${companyName}!`;
      case TemplateType.passwordReset:
        return 'Reset your password';
      default:
        return 'Welcome to the app';
    }
  }

  async sendMail(data: TMailData) {
    const { email, content } = data;
    const { context, type } = content;
    const subject = this.getSubject(type, context.userName, context.companyName);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template: `./${type}`,
        context,
      });
    } catch (error) {
      console.error('error', error);
    } finally {
      return 'complete';
    }
  }
}
