import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

export const mailerConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return {
      transport: {
        host: config.get<string>('SMTP_HOST'),
        port: Number(config.get<string>('SMTP_PORT')),
        secure: false,
        auth: {
          user: config.get<string>('SMTP_USER'),
          pass: config.get<string>('SMTP_PW'),
        },
      },
      defaults: {
        from: `"${config.get<string>('SMTP_FROM_NAME')}" <${config.get<string>('SMTP_FROM_EMAIL')}>`,
      },
      template: {
        dir: './templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  },
};
