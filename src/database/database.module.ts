import { Global, Module } from '@nestjs/common';

import { PrismaProvider } from './infrastructure/providers/prisma/prisma.provider';
import { MongoProvider } from './infrastructure/providers/mongo-db/mongo.provider';

@Global()
@Module({
    providers: [PrismaProvider, MongoProvider],
    exports: [PrismaProvider, MongoProvider]
})
export class DatabaseModule {}
