import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({ imports: [ ConfigModule ] }).compile();
    const config: ConfigService = module.get<ConfigService>(ConfigService);

    expect(new LoggerMiddleware(config)).toBeDefined();
  });
});
