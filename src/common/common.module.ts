import { DynamicModule, Module } from '@nestjs/common';

import { CommonModuleAsyncOptions, CommonModuleOptions, CommonModuleOptionsForRoot } from '@common/domain/interfaces';
import { BcryptProvider } from '@common/application/providers';
import { SECURITY_OPTIONS_KEY } from '@common/application/constants';

@Module({})
export class CommonModule {
    public static register(options: CommonModuleOptions): DynamicModule {
        return {
            module: CommonModule,
            providers: [
                BcryptProvider,
                {
                    provide: SECURITY_OPTIONS_KEY,
                    useValue: options
                }
            ],
            exports: [BcryptProvider]
        };
    };

    public static registerAsync(options: CommonModuleAsyncOptions): DynamicModule {
        return {
            module: CommonModule,
            providers: [
                BcryptProvider,
                {
                    provide: SECURITY_OPTIONS_KEY,
                    useFactory: options.useFactory,
                    inject: options.Inject || []
                }
            ],
            exports: [BcryptProvider]
        };
    }

    public static forRootAsync(options: CommonModuleOptionsForRoot): DynamicModule {
        return {
            global: options.isGlobal || false,
            module: CommonModule,
            providers: [
                BcryptProvider,
                {
                    provide: SECURITY_OPTIONS_KEY,
                    useFactory: options.useFactory,
                    inject: options.Inject || []
                }
            ],
            exports: [BcryptProvider]
        }
    }
}
