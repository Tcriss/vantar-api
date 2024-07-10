import { Module } from '@nestjs/common';

import { ProductService } from './application/services/product.service';
import { ProductRepository } from './infrastructure/repositories/product/product.repository';
import { ProductListRepository } from './infrastructure/repositories/product-list/product-list.repositroy';
import { ProductController } from './infrastructure/controllers/product.controller';
import { Repository } from '../common/domain/entities';
import { ProductEntity } from './domain/entities/product.entity';
import { InvoiceProductList } from '../invoices/domain/types';

@Module({
    providers: [
        {
            provide: Repository<ProductEntity>,
            useClass: ProductRepository
        },
        {
            provide: Repository<InvoiceProductList>,
            useClass: ProductListRepository
        },
        ProductService
    ],
    controllers: [ProductController],
    exports: [Repository<InvoiceProductList>]
})
export class ProductModule {}
