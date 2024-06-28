import { Test, TestingModule } from '@nestjs/testing';
import { BcryptProvider } from './bcrypt.provider';
import { ConfigService } from '@nestjs/config';

describe('BcryptProvider', () => {
  let service: BcryptProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptProvider, ConfigService],
    }).compile();

    service = module.get<BcryptProvider>(BcryptProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
