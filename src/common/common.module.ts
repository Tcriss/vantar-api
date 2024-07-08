import { Module } from "@nestjs/common";

import { BcryptProvider } from "./application/providers/bcrypt.provider";
import { EmailService } from './infrastructure/services/email.service';

@Module({
    providers: [BcryptProvider, EmailService],
    exports: [BcryptProvider]
})
export class CommonModule {}