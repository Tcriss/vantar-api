import { DynamicModule, Global, Module } from '@nestjs/common';

import { PrismaProvider } from './infrastructure/providers/prisma/prisma.provider';
import { MongoProvider } from './infrastructure/providers/mongo-db/mongo.provider';
import { DatabaseModuleAsyncOptions, DatabaseModuleOptions, DatabaseOptions } from './domain/interfaces';
import { DatabaseModuleOptionsKey } from './application/constans/database=module-options.key';

@Global()
@Module({
    providers: [PrismaProvider],
    exports: [PrismaProvider]
})
export class DatabaseModule {
    public static forRoot(options: DatabaseModuleOptions): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal,
            providers: [
                PrismaProvider,
                MongoProvider,
                {
                    provide: DatabaseModuleOptionsKey,
                    useValue: options
                }
            ],
            exports: [PrismaProvider, MongoProvider]
        }
    }

    public static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal,
            imports: options.imports,
            providers: [
                PrismaProvider,
                MongoProvider,
                {
                    provide: DatabaseModuleOptionsKey,
                    useFactory: options.useFactory,
                    inject: options.inject
                }
            ],
            exports: [PrismaProvider, MongoProvider]
        }
    }

    public static forFeature(options: DatabaseOptions) {
        return {
            module: DatabaseModule,
            providers: [
                PrismaProvider,
                MongoProvider,
                {
                    provide: DatabaseModuleOptionsKey,
                    useValue: options
                }
            ],
            exports: [PrismaProvider, MongoProvider]
        }
    }

    public static forFeatureAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
        return {
            module: DatabaseModule,
            imports: options.imports,
            providers: [
                PrismaProvider,
                MongoProvider,
                {
                    provide: DatabaseModuleOptionsKey,
                    useFactory: options.useFactory,
                    inject: options.inject
                }
            ],
            exports: [PrismaProvider, MongoProvider]
        }
    }
};