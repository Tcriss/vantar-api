import { Test, TestingModule } from '@nestjs/testing';

import { MongoProvider } from './mongo.provider';
import { ConfigModule } from '@nestjs/config';

describe('MongoDb', () => {
  let provider: MongoProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoProvider],
      imports: [ConfigModule]
    }).compile();

    provider = module.get<MongoProvider>(MongoProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should connect to the database on module init', async () => {
    jest.spyOn(provider, 'connect');
    provider.onModuleInit();
    expect(provider.connect).toHaveBeenCalled();
  });

  it('should disconnect from the database on module destroy', async () => {
    jest.spyOn(provider, 'close');
    provider.onModuleDestroy();
    expect(provider.close).toHaveBeenCalled();
  });
});
