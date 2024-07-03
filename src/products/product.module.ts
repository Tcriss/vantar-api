import { Module } from '@nestjs/common';

import { ProductRepositoryToken } from './application/decotators';
import { ProductService } from './application/services/product.service';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductController } from './infrastructure/controllers/product.controller';

@Module({
    providers: [
        {
            provide: ProductRepositoryToken,
            useClass: ProductRepository
        },
        ProductService
    ],
    controllers: [ProductController]
})
export class ProductModule {}
