import { Global, Module } from '@nestjs/common';

import { PrismaProvider } from './infrastructure/providers/prisma/prisma.provider';
import { MongoProvider } from './infrastructure/providers/mongo-db/mongo.provider';
import { MongoService } from './infrastructure/services/mongo.service';

@Global()
@Module({
    providers: [PrismaProvider, MongoProvider, MongoService],
    exports: [PrismaProvider, MongoService]
})
export class DatabaseModule {}
