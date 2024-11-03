import { DynamicModule, Module } from '@nestjs/common';

import { ProductEntity } from '@products/domain/entities';
import { ProductModuleAsyncOptions, ProductModuleOptions } from '@products/domain/interfaces';
import { ProductService } from '@products/application/services';
import { ProductListRepositoryToken } from '@products/application/decotators';
import { ProductRepository, ProductListRepository } from '@products/infrastructure/repositories';
import { ProductController } from '@products/infrastructure/controllers';
import { DatabaseModule } from '@database/database.module';
import { Repository } from '@common/domain/entities';

@Module({
    providers: [
        {
            provide: Repository<ProductEntity>,
            useClass: ProductRepository
        },
        ProductService
    ],
    controllers: [ProductController]
})
export class ProductModule {
    public static forFeature(options: ProductModuleOptions): DynamicModule {
        return {
            module: ProductModule,
            imports: [
                DatabaseModule.forFeature({
                    mongoUri: options.mongoUri,
                    databaseName: options.databaseName,
                    collectionName: options.collectionName
                })
            ],
            providers: [
                {
                    provide: ProductListRepositoryToken,
                    useClass: ProductListRepository
                }
            ],
            exports: [ProductListRepositoryToken]
        }
    }

    public static forFeatureAsync(options: ProductModuleAsyncOptions): DynamicModule {
        return {
            module: ProductModule,
            imports: options.imports || [],
            providers: [
                {
                    provide: ProductListRepositoryToken,
                    useClass: ProductListRepository
                }
            ],
            exports: [ProductListRepositoryToken]
        }
    }
}
