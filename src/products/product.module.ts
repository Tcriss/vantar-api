import { Module } from '@nestjs/common';

import { ProductService } from './application/services/product.service';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductRepositoryToken } from './domain/interfaces/product-repository.interface';

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
