import { Module } from '@nestjs/common';

import { ProductService } from './application/services/product.service';
import { ProdcutRepository } from './application/repositories/product.repository';
import { ProductController } from './infrastructure/controllers/product.controller';

@Module({
    providers: [ProductService, ProdcutRepository],
    controllers: [ProductController]
})
export class ProductModule {}
