import { Injectable } from '@nestjs/common';
import { readFileSync} from 'fs';
import { compile } from 'handlebars';
import { join } from 'path';

import { ResendProviderEntity } from '../domain/entities/resend-provider.entiry';
import { EmailModuleOptions } from '../domain/interfaces';
import { EmailOptions } from './decorators/email-options.decorator';
import { UserEntity } from '../../users/domain/entities/user.entity';

@Injectable()
export class EmailService {

    constructor(
        @EmailOptions() private options: EmailModuleOptions,
        private resend: ResendProviderEntity
    ) {}

    public async sendWelcomeEmail(user: Partial<UserEntity>, token: string): Promise<unknown> {
        const templatePath: string = join(__dirname, 'templates', 'activate-account.template.html');
        const templateSource: string = readFileSync(templatePath, 'utf8');
        const template = compile(templateSource);
        const activateUrl: string = this.options.activatationUrl + `/activate?token=${token}`;
        const year: number = 2024;
        const html = template({
            url: this.options.appUrl,
            name: user.name,
            activateUrl,
            year
        });
        
        return this.resend.emails.send({
            from: this.options.deafultSenderEmail || 'onboarding@resend.dev',
            to: user.email,
            subject: 'Bienvenido a Vantar',
            html
        });
    }
}
