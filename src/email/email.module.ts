import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ResendProvider } from './infrastructure/resend.provider';
import { EmailService } from './application/email.service';
import { EMAIL_OPTIONS_KEY } from './application/constants/email.key';
import { EmailModuleAsyncOptions, EmailModuleOptions, EmailModuleOptionsFactory } from './domain/interfaces';
import { ResendProviderEntity } from './domain/entities/resend-provider.entiry';

@Module({})
export class EmailModule {

  public static register(options: EmailModuleOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: EMAIL_OPTIONS_KEY,
          useValue: options
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
    const providers: Provider[] = this.createAsyncProviders(options);

    return {
      module: EmailModule,
      imports: options.imports || [],
      providers: [
        ...providers,
        ResendProvider,
        {
          provide: ResendProviderEntity,
          useClass: ResendProvider
        },
        {
          provide: EMAIL_OPTIONS_KEY,
          useFactory: async (options: EmailModuleOptions) => ({
            defaultSenderEmail: options.deafultSenderEmail || 'onboarding@resend.dev',
            ...options
          }),
          inject: [EMAIL_OPTIONS_KEY],
        },
      ],
      exports: [EmailService],
    };
  }

  private static createAsyncProviders(options: EmailModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: EMAIL_OPTIONS_KEY,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    const useClass = options.useClass || options.useExisting;

    if (useClass) {
      return [
        {
          provide: EMAIL_OPTIONS_KEY,
          useFactory: async (optionsFactory: EmailModuleOptionsFactory) => await optionsFactory.createEmailModuleOptions(),
          inject: [useClass],
        },
        {
          provide: useClass,
          useClass,
        },
      ];
    }

    return [];
  }
}
