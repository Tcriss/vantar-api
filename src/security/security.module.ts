import { DynamicModule, Module } from '@nestjs/common';

import { BcryptProvider } from './application/providers/bcrypt.provider';
import { SecurityModuleAsyncOptions, SecurityModuleOptions } from './doamin';
import { SECURITY_OPTIONS_KEY } from './application/constants';
import { SecurityModuleOptionsForRoot } from './doamin/security-module-forroot-async.options';

@Module({})
export class SecurityModule {
    public static register(options: SecurityModuleOptions): DynamicModule {
        return {
            module: SecurityModule,
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

    public static registerAsync(options: SecurityModuleAsyncOptions): DynamicModule {
        return {
            module: SecurityModule,
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

    public static forRootAsync(options: SecurityModuleOptionsForRoot): DynamicModule {
        return {
            global: options.isGlobal || false,
            module: SecurityModule,
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
