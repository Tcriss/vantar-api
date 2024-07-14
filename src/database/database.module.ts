import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModuleAsyncOptions, DatabaseOptions } from './domain/interfaces';
import { DatabaseModuleOptionsKey } from './application/constans/database=module-options.key';
import { PrismaProvider } from './infrastructure/providers/prisma/prisma.provider';
import { MongoProvider } from './infrastructure/providers/mongo-db/mongo.provider';

@Module({})
export class DatabaseModule {
    public static forRoot(options: { isGlobal: boolean }): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal,
            providers: [PrismaProvider],
            exports: [PrismaProvider]
        }
    }

    public static forRootAsync(options: { isGlobal: boolean }): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal,
            providers: [PrismaProvider],
            exports: [PrismaProvider]
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