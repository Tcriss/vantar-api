import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { DatabaseModuleAsyncOptions, DatabaseOptions } from './domain/interfaces';
import { DatabaseModuleOptionsKey } from './application/constans/database=module-options.key';
import { PrismaProvider } from './infrastructure/providers/prisma/prisma.provider';
import { MongoProvider } from './infrastructure/providers/mongo-db/mongo.provider';
import { PrismaClientExceptionFilter } from './application/filters/prisma-client-exception/prisma-client-exception.filter';

@Module({})
export class DatabaseModule {
    public static forRoot(options: { isGlobal?: boolean }): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal || false,
            providers: [
                PrismaProvider,
                {
                    provide: APP_FILTER,
                    useClass: PrismaClientExceptionFilter
                }
            ],
            exports: [PrismaProvider]
        }
    }

    public static forRootAsync(options: { isGlobal?: boolean }): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal || false,
            providers: [
                PrismaProvider,
                {
                    provide: APP_FILTER,
                    useClass: PrismaClientExceptionFilter
                }
            ],
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
                },
                {
                    provide: APP_FILTER,
                    useClass: PrismaClientExceptionFilter
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
                },
                {
                    provide: APP_FILTER,
                    useClass: PrismaClientExceptionFilter
                }
            ],
            exports: [PrismaProvider, MongoProvider]
        }
    }
};