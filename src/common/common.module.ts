import { DynamicModule, Module } from '@nestjs/common';

import { BcryptProvider } from './application/providers/bcrypt.provider';
import { CommonModuleAsyncOptions, CommonModuleOptions } from './domain/interfaces';
import { SECURITY_OPTIONS_KEY } from './constants';
import { CommonModuleOptionsForRoot } from './domain/interfaces/security-module-forroot-async.options';

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
