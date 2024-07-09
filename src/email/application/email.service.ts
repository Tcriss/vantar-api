import { Injectable } from '@nestjs/common';

import { ResendProviderEntity } from '../domain/entities/resend-provider.entiry';
import { EmailModuleOptions } from '../domain/interfaces';
import { EmailOptions } from './decorators/email-options.decorator';

@Injectable()
export class EmailService {

    constructor(
        @EmailOptions() private options: EmailModuleOptions,
        private resend: ResendProviderEntity
    ) {}

    public async sendWelcomeEmail(to: string, token: string, user: any): Promise<unknown> {
        const activateUrl: string = this.options.activatationUrl + `/activate?token=${token}`;
        
        return this.resend.emails.send({
            from: this.options.deafultSenderEmail,
            to: to,
            subject: 'Bienvenido a Vantar',
            html: `
                <html lang="en">
                    <head>
                        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                        <meta name="x-apple-disable-message-reformatting" />
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
                    </head>
                    <body style="font-family: Poppins; box-sizing: border-box; width: 100vw; display: flex; flex-direction: column; align-items: center;">
                        <main style="box-sizing: border-box; max-width: 400px; width: 100% !important; display: grid; gap: 10px; padding: 10px">
                            <section style="width: 100%; display: flex; flex-direction: column; gap: 10px;">
                                <header style="width: 100%;">
                                    <h1 style="margin: 0; text-align: center;">Hola ${user.name} bienvenido a Vantar</h1>
                                </header>
                                <content style="width: 100%; display: flex; flex-direction: column; gap: 10px;">
                                    <p style="text-align: center; margin: 0; font-size: 15px;">Gracias por preferirnos, ahora el siguiente paso es activar tu cuenta. clickea en confirmar e-mail, y ya podrás disfrutar de todos los beneficios que te brinda Vantar.</p>
                                    <a href='${activateUrl}' style="box-sizing: border-box; border-radius: 10px; width: 100%; text-align: center; background-color: rgb(0, 157, 255); padding: 10px; font-weight: 600; color: white; text-decoration: none; box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
                                        Confirmar e-mail
                                    </a>
                                    <!-- <p style="text-align: center;">No compartas este correo con nadie, es estrictamente confidencial.</p> -->
                                </content>
                            </section>
                            <footer style="width: 100%;">
                                <p style="font-weight: 600; color: gray; font-size: 14px; text-align: center;">Copyright &copy; 2024 | Vantar Inventory</p>
                            </footer>
                        </main>
                    </body>
                </html>
            `,
        });
    }
}
