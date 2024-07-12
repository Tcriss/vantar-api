import { Test, TestingModule } from '@nestjs/testing';

import { ResendProvider } from './resend.provider';
import { EMAIL_OPTIONS_KEY } from '../application/constants/email-options.key';

describe('Resend', () => {
  let provider: ResendProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendProvider,
        {
          provide: EMAIL_OPTIONS_KEY,
          useValue: {
            apiKey: 'string',
            activatationUrl: 'string',
            resetPasswordUrl: 'string'
          }
        }
      ],
    }).compile();

    provider = module.get<ResendProvider>(ResendProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
