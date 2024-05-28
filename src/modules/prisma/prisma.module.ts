import { Module } from '@nestjs/common';

import { PrismaProvider } from './providers/prisma.provider';

@Module({
    providers: [PrismaProvider],
    exports: [PrismaProvider]
})
export class PrismaModule {}
