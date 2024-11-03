import { DynamicModule, Module } from '@nestjs/common';

import { ResendProvider } from './infrastructure/resend.provider';
import { ResendProviderEntity } from '@email/domain/entities';
import { EmailModuleAsyncOptions, EmailModuleOptions } from '@email/domain/interfaces';
import { EmailService } from '@email/application/email.service';
import { EMAIL_OPTIONS_KEY } from '@email/application/constants';

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
      imports: options.imports ?? [],
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
