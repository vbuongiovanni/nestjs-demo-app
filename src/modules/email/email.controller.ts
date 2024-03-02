import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ReqAuthType } from 'src/common/decorators';
import { AuthType } from 'src/common/types';
import { TemplateType } from './types';

@Controller('email')
@ReqAuthType(AuthType.Public)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  sendWelcomeAboard() {
    const name = 'Vincent b';
    const email = 'vincentbuongiovanni@gmail.com';
    const content = {
      context: {
        name,
        link: 'https://www.google.com',
      },
      type: TemplateType.welcomeAboard,
    };

    return this.emailService.sendMail({
      email,
      content,
    });
  }
}
