import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/common/config/mailer.config';

@Module({
  imports: [MailerModule.forRootAsync(mailerConfig)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
