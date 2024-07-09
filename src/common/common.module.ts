import { Module } from "@nestjs/common";

import { BcryptProvider } from "./application/providers/bcrypt.provider";

@Module({
    providers: [BcryptProvider],
    exports: [BcryptProvider]
})
export class CommonModule {}