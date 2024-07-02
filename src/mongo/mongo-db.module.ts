import { Global, Module } from '@nestjs/common';

import { MongoProvider } from './infrastructure/providers/mongo.provider';

@Global()
@Module({
  providers: [MongoProvider],
  exports: [MongoProvider]
})
export class MongoDbModule {}
