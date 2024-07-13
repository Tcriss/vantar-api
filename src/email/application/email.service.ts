import { Injectable } from '@nestjs/common';

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
        const activateUrl: string = this.options.activatationUrl + `/activate?token=${token}`;
        const year: number = 2024;
        
        return this.resend.emails.send({
            from: this.options.deafultSenderEmail || 'onboarding@resend.dev',
            to: user.email,
            subject: 'Bienvenido a Vantar',
            html: `
                <!DOCTYPE HTML>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
                        <style>
                            * { margin: 0; box-sizing: border-box; font-family: Poppins, sans-serif !important;}
                        </style>
                    </head>
                    <body style="box-sizing: border-box; width: 100%; padding: 0 20px;">
                        <main style="box-sizing: border-box; width: 100%; padding: 10px">
                            <section style="width: 100%;">
                                <header style="width: 100%;">
                                    <h1 style="margin: 60px 0; text-align: center;">Bienvenido a Vantar, ${user.name}</h1>
                                </header>
                                <content style="width: 100%; display: block;">
                                    <p style="margin: 20px 0; font-size: 14px;">Hola ${user.name}!</p>
                                    <p style="margin: 30px 0; font-size: 14px;">Gracias por preferirrnos, ahora el siguiente paso será activar tu cuenta. Solo necesitamos confirmar tu e-mail y ya podrás usar todos los beneficios que te ofrece Vantar.</p>
                                    <div style="margin: 50px 0; text-align: center;">
                                        <a href='${activateUrl}' style="box-sizing: border-box; border-radius: 10px; width: 100%; text-align: center; background-color: rgb(0, 157, 255); padding: 10px; font-size: 14px; font-weight: 600; color: white; text-decoration: none; box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">Confirmar e-mail</a>
                                    </div>
                                    <div style="font-size: 14px;">
                                        <p style="margin: 0;">Saludos cordiales,</p>
                                        <p style="margin: 0;">Equipo tecnico de Vantar</p>
                                    </div>
                                </content>
                            </section>
                            <footer style="width: 100%; margin: 30px 0;">
                                <p style="font-weight: 600; color: gray; font-size: 14px; text-align: center;">Copyright &copy; ${year} | Vantar Inventory</p>
                            </footer>
                        </main>
                    </body>
                </html>
            `,
        });
    }
}
