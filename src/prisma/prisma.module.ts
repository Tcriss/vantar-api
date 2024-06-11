import { Global, Module } from '@nestjs/common';

import { PrismaProvider } from './application/providers/prisma.provider';

@Global()
@Module({
    providers: [PrismaProvider],
    exports: [PrismaProvider]
})
export class PrismaModule {}
