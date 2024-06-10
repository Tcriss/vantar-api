import { Module } from '@nestjs/common';

import { ProductService } from './application/services/product.service';
import { ProductRepository } from './application/repositories/product.repository';
import { ProductController } from './infrastructure/controllers/product.controller';

@Module({
    providers: [ProductService, ProductRepository],
    controllers: [ProductController]
})
export class ProductModule {}
