import { DynamicModule, Module } from '@nestjs/common';

import { ProductModuleAsyncOptions, ProductModuleOptions } from './domain/interfaces';
import { ProductService } from './application/services/product.service';
import { ProductRepository } from './infrastructure/repositories/product/product.repository';
import { ProductListRepository } from './infrastructure/repositories/product-list/product-list.repositroy';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductEntity } from './domain/entities/product.entity';
import { DatabaseModule } from '../database/database.module';
import { ProductListRepositoryToken } from './application/decotators';
import { Repository } from '../common/domain/entities';

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
