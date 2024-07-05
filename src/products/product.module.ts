import { Module } from '@nestjs/common';

import { ProductListRepositoryToken, ProductRepositoryToken } from './application/decotators';
import { ProductService } from './application/services/product.service';
import { ProductRepository } from './infrastructure/repositories/product/product.repository';
import { ProductListRepository } from './infrastructure/repositories/product-list/product-list.repositroy';
import { ProductController } from './infrastructure/controllers/product.controller';

@Module({
    providers: [
        {
            provide: ProductRepositoryToken,
            useClass: ProductRepository
        },
        {
            provide: ProductListRepositoryToken,
            useClass: ProductListRepository
        },
        ProductService
    ],
    controllers: [ProductController],
    exports: [ProductListRepositoryToken]
})
export class ProductModule {}
