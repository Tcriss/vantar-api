import { Test, TestingModule } from '@nestjs/testing';

import { EmailService } from './email.service';
import { EMAIL_OPTIONS_KEY } from './constants/email-options.key';
import { ResendProviderEntity } from '../domain/entities/resend-provider.entiry';
import { ResendProvider } from '../infrastructure/resend.provider';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: EMAIL_OPTIONS_KEY,
          useValue: {
            apiKey: 'string',
            activatationUrl: 'string',
            resetPasswordUrl: 'string'
          }
        },
        {
          provide: ResendProviderEntity,
          useClass: ResendProvider
        }
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
