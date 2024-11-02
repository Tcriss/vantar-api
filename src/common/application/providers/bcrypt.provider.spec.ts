import { Test, TestingModule } from '@nestjs/testing';

import { BcryptProvider } from './bcrypt.provider';
import { SECURITY_OPTIONS_KEY } from '../../constants';

describe('BcryptProvider', () => {
  let service: BcryptProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BcryptProvider,
        {
          provide: SECURITY_OPTIONS_KEY,
          useValue: { saltRounds: 5 }
        }
      ],
    }).compile();

    service = module.get<BcryptProvider>(BcryptProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
