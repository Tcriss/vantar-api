import { DynamicModule, Module } from '@nestjs/common';

import { ResendProvider } from './infrastructure/resend.provider';
import { EmailService } from './application/email.service';
import { EMAIL_OPTIONS_KEY } from './application/constants/email-options.key';
import { EmailModuleAsyncOptions, EmailModuleOptions } from './domain/interfaces';
import { ResendProviderEntity } from './domain/entities/resend-provider.entiry';

@Module({})
export class EmailModule {

  public static register(moduleOptions: { options: EmailModuleOptions, isGlobal?: boolean }): DynamicModule {
    return {
      module: EmailModule,
      global: moduleOptions.isGlobal ?? false,
      providers: [
        {
          provide: EMAIL_OPTIONS_KEY,
          useValue: moduleOptions.options
        },
        {
          provide: ResendProviderEntity,
          useClass: ResendProvider
        },
        EmailService
      ],
      exports: [EmailService]
    }
  }

  public static registerAsync(options: EmailModuleAsyncOptions): DynamicModule {
    return {
      module: EmailModule,
      imports: options.imports || [],
      global: options.isGlobal ?? false,
      providers: [
        EmailService,
        {
          provide: ResendProviderEntity,
          useClass: ResendProvider
        },
        {
          provide: EMAIL_OPTIONS_KEY,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
      ],
      exports: [EmailService],
    };
  }
}
