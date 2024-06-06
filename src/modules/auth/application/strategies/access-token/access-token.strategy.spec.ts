// src/auth/strategies/acces-token.strategy.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { AccessTokenStrategy } from './access-token.strategy';
import { Payload } from '../../../domain/types/payload.type';

describe('AccesTokenStrategy', () => {
  let strategy: AccessTokenStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<AccessTokenStrategy>(AccessTokenStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate the payload', async () => {
    const payload: Payload = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
    const validatedPayload = await strategy.validate(payload);
    expect(validatedPayload).toEqual(payload);
  });
});
