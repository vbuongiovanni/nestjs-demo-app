import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TMailData, TemplateType } from './types';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  private getSubject(type: TemplateType, name: string) {
    switch (type) {
      case TemplateType.welcomeAboard:
        return `Welcome aboard, ${name}!`;
      case TemplateType.passwordReset:
        return 'Reset your password';
      default:
        return 'Welcome to the app';
    }
  }

  async sendMail(data: TMailData) {
    const { email, content } = data;
    const { context, type } = content;
    const subject = this.getSubject(type, context.name);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template: `./${type}`,
        context,
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      return 'complete';
    }
  }
}
