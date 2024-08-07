import { Test, TestingModule } from '@nestjs/testing';

import { MongoProvider } from './mongo.provider';
import { DatabaseModuleOptionsKey } from '../../../application/constans/database=module-options.key';

describe('MongoDb', () => {
  let provider: MongoProvider<unknown>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DatabaseModuleOptionsKey,
          useValue: {
            mongoUri: 'mongodb://test_db_name',
            collectionName: 'test',
            databaseName: 'test'
          }
        },
        MongoProvider
      ],
    }).compile();

    provider = module.get<MongoProvider<unknown>>(MongoProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
