import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { MongoProvider } from './mongo.provider';

describe('MongoDb', () => {
  let provider: MongoProvider;
  let configServiceMock = {
    get: jest.fn().mockReturnValue('mongodb://test_db_name'),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: configServiceMock
        },
        MongoProvider
      ],
    }).compile();

    provider = module.get<MongoProvider>(MongoProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
