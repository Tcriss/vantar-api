import { Test, TestingModule } from '@nestjs/testing';

import { EmailService } from './email.service';
import { EMAIL_OPTIONS_KEY } from '@email/application/constants';
import { ResendProviderEntity } from '@email/domain/entities';
import { ResendProvider } from '@email/infrastructure/resend.provider';

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
