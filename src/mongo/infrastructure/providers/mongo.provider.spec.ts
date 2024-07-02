import { Test, TestingModule } from '@nestjs/testing';
import { MongoDb } from './mongo.provider';

describe('MongoDb', () => {
  let provider: MongoDb;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoDb],
    }).compile();

    provider = module.get<MongoDb>(MongoDb);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
