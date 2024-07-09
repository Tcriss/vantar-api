import { Test, TestingModule } from '@nestjs/testing';
import { ResendProvider } from './resend.provider';

describe('Resend', () => {
  let provider: ResendProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResendProvider],
    }).compile();

    provider = module.get<ResendProvider>(ResendProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
